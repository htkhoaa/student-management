from fastapi import APIRouter
from app.api.v1.class_api import router as class_router
from app.api.v1.endpoints import auth, dashboard, student
api_router = APIRouter()


# Register Authentication endpoints
# prefix="/auth": Routes in auth.py will start with /api/v1/auth
# tags=["auth"]: Groups these endpoints under "auth" in Swagger UI documentation

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(class_router, prefix="/classes", tags=["classes"])
api_router.include_router(student.router, prefix="/students", tags=["Students"])

