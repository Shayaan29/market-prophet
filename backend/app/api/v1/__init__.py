from fastapi import APIRouter
from app.api.v1.endpoints import prices, predict, assets, markets

router = APIRouter()
router.include_router(assets.router,  prefix="/assets",  tags=["Assets"])
router.include_router(prices.router,  prefix="/prices",  tags=["Prices"])
router.include_router(predict.router, prefix="/predict", tags=["Predictions"])
router.include_router(markets.router, prefix="/markets", tags=["Markets"])
