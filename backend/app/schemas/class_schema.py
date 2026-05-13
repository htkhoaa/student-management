from pydantic import BaseModel

class ClassResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True