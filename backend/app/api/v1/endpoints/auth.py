from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.auth import LoginRequest, AuthResponse
from app.schemas.user import UserResponse, PasswordChangeRequest
from app.db.session import get_db
from app.core.security import role_required
from app.models.user_model import User
from app.models.constant import UserRole
from app.services.auth_service import AuthService

router = APIRouter()

@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK
)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.login(data)

# API Get Profile
@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK
)
def get_me(current_user: User = Depends(role_required([UserRole.ADMIN, UserRole.STUDENT]))):
    return current_user

@router.post("/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: PasswordChangeRequest, db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.STUDENT]))
):
    service = AuthService(db)
    return service.change_password(payload)
