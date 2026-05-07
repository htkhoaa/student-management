from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.auth import LoginRequest, AuthResponse
from app.services import auth_service
from app.db.session import get_db

router = APIRouter()

@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK
)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(db, data)