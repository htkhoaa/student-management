from app.exceptions.base import AppException
from app.exceptions.error_code import ErrorCode
from app.core.security import verify_password, generate_access_token
from app.schemas.auth import LoginRequest
from app.repositories.user_repo import get_user_by_username
from sqlalchemy.orm import Session

def login(db: Session, req: LoginRequest):
    user = get_user_by_username(db, req.username)
    # 1. Validate whether user exists and password verified.
    if not user or not verify_password(req.password, user.password_hash):
        raise AppException(ErrorCode.UNAUTHENTICATED)

    # 3. Generate token
    token = generate_access_token(user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }