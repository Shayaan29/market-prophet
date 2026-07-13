"""Pydantic schemas for the market list (browse/trending) response."""

from pydantic import BaseModel


class MarketCoin(BaseModel):
    id: str
    symbol: str
    name: str
    image: str
    current_price: float
    market_cap: float
    market_cap_rank: int | None
    price_change_percentage_24h: float | None


class MarketsResponse(BaseModel):
    coins: list[MarketCoin]
