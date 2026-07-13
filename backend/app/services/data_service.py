"""
DataService — Fetches and caches market price data.

Responsibilities:
  - Fetch price history from CoinGecko API
  - Cache results in Redis (15 min TTL) to avoid rate limits
  - Normalize raw API response into our internal schema

Phase 1: No Redis — fetches directly from CoinGecko every time.
Phase 2: Add Redis caching layer here without changing the interface.

No Redis instance is available in this dev environment, so in the
meantime we cache in-process with the same 15 min TTL. Swap this out
for the Redis-backed cache when Phase 2 lands.
"""

import time
import httpx
from datetime import datetime

from app.core.config import get_settings
from app.schemas.price import PriceHistoryResponse, PricePoint
from app.schemas.market import MarketCoin, MarketsResponse

settings = get_settings()

CACHE_TTL_SECONDS = 15 * 60

# Module-level so it survives across the per-request DataService() instances
# created in prices.py and prediction_service.py.
_cache: dict[tuple[str, int], tuple[float, dict]] = {}
_markets_cache: dict[int, tuple[float, list]] = {}


class DataService:

    async def get_price_history(
        self, asset_id: str, days: int = 30
    ) -> PriceHistoryResponse:
        """
        Fetch historical prices for an asset.

        Args:
            asset_id: CoinGecko asset ID (e.g. 'bitcoin')
            days: Number of days of history to return

        Returns:
            PriceHistoryResponse with list of timestamped prices
        """
        raw = await self._get_cached_or_fetch(asset_id=asset_id, days=days)
        return self._parse_response(asset_id=asset_id, days=days, raw=raw)

    async def _get_cached_or_fetch(self, asset_id: str, days: int) -> dict:
        key = (asset_id, days)
        cached = _cache.get(key)
        if cached is not None:
            cached_at, raw = cached
            if time.monotonic() - cached_at < CACHE_TTL_SECONDS:
                return raw

        raw = await self._fetch_from_coingecko(asset_id=asset_id, days=days)
        _cache[key] = (time.monotonic(), raw)
        return raw

    async def get_markets(self, limit: int = 50) -> MarketsResponse:
        """
        Fetch the top coins by market cap, with 24h price change —
        used for the browse/trending list. Unlike get_price_history,
        this doesn't require a trained prediction model.

        Args:
            limit: Number of coins to return, ranked by market cap

        Returns:
            MarketsResponse with the coin list
        """
        raw = await self._get_cached_markets_or_fetch(limit=limit)
        coins = [
            MarketCoin(
                id=c["id"],
                symbol=c["symbol"].upper(),
                name=c["name"],
                image=c["image"],
                current_price=c["current_price"],
                market_cap=c["market_cap"],
                market_cap_rank=c["market_cap_rank"],
                price_change_percentage_24h=c["price_change_percentage_24h"],
            )
            for c in raw
        ]
        return MarketsResponse(coins=coins)

    async def _get_cached_markets_or_fetch(self, limit: int) -> list:
        cached = _markets_cache.get(limit)
        if cached is not None:
            cached_at, raw = cached
            if time.monotonic() - cached_at < CACHE_TTL_SECONDS:
                return raw

        raw = await self._fetch_markets_from_coingecko(limit=limit)
        _markets_cache[limit] = (time.monotonic(), raw)
        return raw

    async def _fetch_markets_from_coingecko(self, limit: int) -> list:
        """Raw HTTP call to CoinGecko coins/markets endpoint."""
        url = f"{settings.COINGECKO_BASE_URL}/coins/markets"
        params = {
            "vs_currency": "usd",
            "order": "market_cap_desc",
            "per_page": str(limit),
            "page": "1",
            "price_change_percentage": "24h",
            "sparkline": "false",
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()  # raises on 4xx/5xx
            return response.json()

    async def _fetch_from_coingecko(self, asset_id: str, days: int) -> dict:
        """Raw HTTP call to CoinGecko market_chart endpoint."""
        url = f"{settings.COINGECKO_BASE_URL}/coins/{asset_id}/market_chart"
        params = {"vs_currency": "usd", "days": str(days)}

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()  # raises on 4xx/5xx
            return response.json()

    def _parse_response(
        self, asset_id: str, days: int, raw: dict
    ) -> PriceHistoryResponse:
        """Convert raw CoinGecko response to our internal schema."""
        price_points = [
            PricePoint(
                timestamp=datetime.utcfromtimestamp(ts / 1000),  # ms → s
                price=price,
            )
            for ts, price in raw.get("prices", [])
        ]

        return PriceHistoryResponse(
            asset_id=asset_id,
            days=days,
            prices=price_points,
        )
