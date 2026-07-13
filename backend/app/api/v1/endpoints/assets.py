"""
Supported assets endpoint.

GET /api/v1/assets
  → Lists all assets the platform currently supports predictions for.
"""

from fastapi import APIRouter

router = APIRouter()

# Phase 1: hardcoded list. Phase 2: pull from DB.
SUPPORTED_ASSETS = [
    {"id": "bitcoin",  "symbol": "BTC", "name": "Bitcoin",  "type": "crypto"},
    {"id": "ethereum", "symbol": "ETH", "name": "Ethereum", "type": "crypto"},
]


@router.get("/")
async def list_assets():
    """Return all assets that have a trained model available."""
    return {"assets": SUPPORTED_ASSETS}
