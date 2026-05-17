from app.exceptions.base import AppException
from app.exceptions.error_code import ErrorCode
from app.core.security import verify_password, generate_access_token, get_password_hash
from app.schemas.auth import LoginRequest
from app.repositories.user_repo import UserRepository
from sqlalchemy.orm import Session
from app.schemas.user import PasswordChangeRequest


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def login(self, req: LoginRequest):
        user = self.user_repo.get_user_by_username(req.username)

        if not user or not verify_password(req.password, user.password_hash):
            raise AppException(ErrorCode.UNAUTHENTICATED)

        if not user.is_active:
            raise AppException(ErrorCode.UNAUTHORIZED, "You have been deactived")

        token = generate_access_token(user)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }

    def change_password(self, payload: PasswordChangeRequest):
        user = self.user_repo.get_user_by_username(payload.username)
        if not user:
            raise AppException(ErrorCode.USER_NOT_FOUND)

        if not verify_password(payload.old_password, user.password_hash):
            raise AppException(ErrorCode.INVALID_OLD_PASSWORD)

        try:
            user.password_hash = get_password_hash(payload.new_password)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise AppException(gtErrorCode.INTERNAL_SERVER_ERROR, f"Failed to update new password: {str(e)}")
