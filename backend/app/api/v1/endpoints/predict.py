"""
Prediction endpoints.

GET /api/v1/predict/{asset_id}
  → Returns next-day price prediction + confidence score for a given asset.
"""

from fastapi import APIRouter, HTTPException, Depends
from app.schemas.prediction import PredictionResponse
from app.services.prediction_service import PredictionService

router = APIRouter()


@router.get("/{asset_id}", response_model=PredictionResponse)
async def get_prediction(asset_id: str):
    """
    Predict the next closing price for a given asset.

    - **asset_id**: e.g. `bitcoin`, `ethereum`, `AAPL`
    - Returns predicted price, confidence score, and model metadata.
    """
    service = PredictionService()
    result = await service.predict(asset_id=asset_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"No model found for asset '{asset_id}'. "
                   "Ensure the model has been trained and exported."
        )

    return result
