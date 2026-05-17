from typing import Optional

from pydantic import BaseModel, Field
from app.models.constant import UserRole


class UserResponse(BaseModel):
    id: int
    username: str
    role: UserRole
    student_id: Optional[int]

    class Config:
        from_attributes = True


class PasswordChangeRequest(BaseModel):
    username: str
    old_password: str = Field(..., min_length=5)
    new_password: str = Field(..., min_length=5)
