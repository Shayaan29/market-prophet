"""Unit tests for DataService."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.data_service import DataService


MOCK_COINGECKO_RESPONSE = {
    "prices": [
        [1718000000000, 67500.0],
        [1718086400000, 68000.0],
        [1718172800000, 67200.0],
    ]
}


@pytest.mark.asyncio
async def test_get_price_history_returns_correct_count():
    """Should return one PricePoint per price entry from the API."""
    service = DataService()

    with patch.object(service, "_fetch_from_coingecko",
                      new_callable=AsyncMock,
                      return_value=MOCK_COINGECKO_RESPONSE):
        result = await service.get_price_history(asset_id="bitcoin", days=3)

    assert len(result.prices) == 3
    assert result.asset_id == "bitcoin"


@pytest.mark.asyncio
async def test_get_price_history_parses_prices_correctly():
    """Prices should be extracted correctly from the raw API response."""
    service = DataService()

    with patch.object(service, "_fetch_from_coingecko",
                      new_callable=AsyncMock,
                      return_value=MOCK_COINGECKO_RESPONSE):
        result = await service.get_price_history(asset_id="bitcoin", days=3)

    assert result.prices[0].price == 67500.0
    assert result.prices[1].price == 68000.0
