from pydantic import BaseModel, Field
from typing import Optional
from app.models.constant import GenderType


# 1. STUDENT CREATE REQUEST
class StudentCreateRequest(BaseModel):
    """DTO for creating a new student. System auto-generates Username and Email."""
    full_name: str = Field(..., max_length=150, min_length=2, description="Student full name")
    gender: GenderType = Field(default=GenderType.MALE, description="Student gender")
    phone: Optional[str] = Field(None, max_length=20, pattern=r"^[0-9+]*$", description="Phone number")
    class_id: int = Field(..., description="Class ID")

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "John Doe",
                "gender": "MALE",
                "phone": "0905123456",
                "class_id": 1
            }
        }


# 3. STUDENT RESPONSE
class StudentResponse(BaseModel):
    """DTO for student output data, including account credentials and relation details."""
    id: int
    full_name: str
    email: str
    gender: GenderType
    phone: Optional[str] = None
    class_id: int
    class_name: str
    username: Optional[str] = None
    is_active: Optional[bool] = True

    model_config = {
        "from_attributes": True
    }
