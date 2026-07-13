"""Pydantic schemas for price history responses."""

from pydantic import BaseModel
from datetime import datetime


class PricePoint(BaseModel):
    timestamp: datetime
    price: float
    volume: float | None = None


class PriceHistoryResponse(BaseModel):
    asset_id: str
    currency: str = "usd"
    days: int
    prices: list[PricePoint]
