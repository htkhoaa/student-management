from datetime import datetime, timedelta, timezone
from jose import jwt
from .config import settings
import bcrypt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user_model import User
from app.exceptions.base import AppException, ErrorCode
from app.repositories.user_repo import get_user_by_username

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def get_password_hash(plain_password: str) -> str:
    pwd_bytes = plain_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def generate_access_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(seconds=settings.JWT_TOKEN_EXPIRATION)
    to_encode = {
        "exp": expire,
        "sub": str(user.username),
        "role": user.role
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


security_scheme = HTTPBearer()
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_identifier: str = payload.get("sub")
        if user_identifier is None:
            raise AppException(ErrorCode.CREDENTIALS_VALIDATION_FAILED)
    except Exception:
        raise AppException(ErrorCode.INVALID_TOKEN)

    user = get_user_by_username(db, user_identifier)
    if user is None:
        raise AppException(ErrorCode.USER_NOT_FOUND)
    return user


def role_required(allowed_roles: list):
    def decorator(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise AppException(ErrorCode.UNAUTHORIZED)
        return current_user
    return decorator
