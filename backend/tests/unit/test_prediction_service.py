"""
Unit tests for PredictionService.

Run with: pytest tests/unit/test_prediction_service.py -v
"""

import pytest
import numpy as np
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime

from app.services.prediction_service import PredictionService
from app.schemas.price import PriceHistoryResponse, PricePoint


def make_fake_history(n_prices: int = 65) -> PriceHistoryResponse:
    """Helper: create fake price history for testing."""
    prices = [
        PricePoint(timestamp=datetime.utcnow(), price=float(50000 + i * 100))
        for i in range(n_prices)
    ]
    return PriceHistoryResponse(asset_id="bitcoin", days=65, prices=prices)


@pytest.mark.asyncio
async def test_predict_returns_none_when_no_model():
    """Should return None if no model file exists for the asset."""
    service = PredictionService()

    with patch.object(service, "_load_model", return_value=None):
        result = await service.predict("unknown_asset")

    assert result is None


@pytest.mark.asyncio
async def test_predict_returns_response_with_valid_model():
    """Should return a PredictionResponse when model and data are available."""
    service = PredictionService()

    fake_model = MagicMock()
    fake_model.predict.return_value = np.array([[0.75]])

    with patch.object(service, "_load_model", return_value=fake_model), \
         patch.object(service.data_service, "get_price_history",
                      new_callable=AsyncMock, return_value=make_fake_history()):

        result = await service.predict("bitcoin")

    assert result is not None
    assert result.asset_id == "bitcoin"
    assert result.predicted_price > 0
    assert 0.0 <= result.confidence <= 1.0


@pytest.mark.asyncio
async def test_predict_returns_none_when_insufficient_data():
    """Should return None if fewer than 60 price points available."""
    service = PredictionService()
    fake_model = MagicMock()

    with patch.object(service, "_load_model", return_value=fake_model), \
         patch.object(service.data_service, "get_price_history",
                      new_callable=AsyncMock,
                      return_value=make_fake_history(n_prices=10)):  # too few

        result = await service.predict("bitcoin")

    assert result is None
