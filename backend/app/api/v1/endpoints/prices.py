"""
Price history endpoints.

GET /api/v1/prices/{asset_id}?days=30
  → Returns historical OHLCV price data for charting.
"""

from fastapi import APIRouter, Query
from app.schemas.price import PriceHistoryResponse
from app.services.data_service import DataService

router = APIRouter()


@router.get("/{asset_id}", response_model=PriceHistoryResponse)
async def get_price_history(
    asset_id: str,
    days: int = Query(default=30, ge=1, le=365, description="Number of days of history"),
):
    """Return historical closing prices for the given asset."""
    service = DataService()
    return await service.get_price_history(asset_id=asset_id, days=days)
