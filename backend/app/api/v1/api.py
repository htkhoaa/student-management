from fastapi import APIRouter
from app.api.v1.endpoints import auth, dashboard, student, classes
api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(classes.router, prefix="/classes", tags=["classes"])
api_router.include_router(student.router, prefix="/students", tags=["students"])