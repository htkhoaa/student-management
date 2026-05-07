from pydantic import BaseModel, ConfigDict, computed_field
from app.models.constant import UserRole
class UserResponse(BaseModel):
    id: int
    username: str
    # @computed_field
    # def full_name(self) -> str:
    #     if self.student:
    #         return self.student.full_name
    #     return self.username
    role: UserRole

    # model_config = ConfigDict(from_attributes=True)