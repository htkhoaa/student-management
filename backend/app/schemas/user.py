from pydantic import BaseModel
from app.models.constant import UserRole
class UserResponse(BaseModel):
    id: int
    username: str
    role: UserRole