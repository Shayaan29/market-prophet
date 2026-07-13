"""
Market list endpoint.

GET /api/v1/markets?limit=50
  → Returns the top coins by market cap with current price and 24h
    change, for browsing — independent of whether a prediction model
    exists for that coin.
"""

from fastapi import APIRouter, Query
from app.schemas.market import MarketsResponse
from app.services.data_service import DataService

router = APIRouter()


@router.get("/", response_model=MarketsResponse)
async def list_markets(
    limit: int = Query(default=50, ge=1, le=250, description="Number of coins to return"),
):
    """Return the top coins by market cap."""
    service = DataService()
    return await service.get_markets(limit=limit)
