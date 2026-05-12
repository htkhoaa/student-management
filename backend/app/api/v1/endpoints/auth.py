from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.auth import LoginRequest, AuthResponse
from app.schemas.user import UserResponse
from app.services import auth_service
from app.db.session import get_db
from app.core.security import role_required
from app.models.user_model import User
from app.models.constant import UserRole

router = APIRouter()

@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK
)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(db, data)

# API Get Profile
@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK
)
def get_me(current_user: User = Depends(role_required([UserRole.ADMIN, UserRole.STUDENT]))):
    return current_user

# Secret API - Accessible only by ADMIN
@router.get(
    "/admin-status",
    status_code=status.HTTP_200_OK
)
def check_admin_status(current_admin: User = Depends(role_required([UserRole.ADMIN]))):
    """
    If a Student uses their token to access this endpoint,
    the backend will immediately return a 403 Forbidden error.
    """
    return {"message": f"Hello {current_admin.username}, You have admin access!"}
