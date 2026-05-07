from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class LoginRequest(BaseModel):
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Username must be between 3 and 50 characters"
    )

    password: str = Field(
        ...,
        min_length=5,
        description="Password must be at least 5 characters"
    )

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
