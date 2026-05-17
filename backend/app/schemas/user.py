from pydantic import BaseModel, Field
from app.models.constant import UserRole
class UserResponse(BaseModel):
    id: int
    username: str
    role: UserRole


class PasswordChangeRequest(BaseModel):
    username: str
    old_password: str = Field(..., min_length=5)
    new_password: str = Field(..., min_length=5)
