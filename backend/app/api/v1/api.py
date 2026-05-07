from fastapi import APIRouter
from app.api.v1.endpoints import auth

api_router = APIRouter()


# Register Authentication endpoints
# prefix="/auth": Routes in auth.py will start with /api/v1/auth
# tags=["auth"]: Groups these endpoints under "auth" in Swagger UI documentation

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
