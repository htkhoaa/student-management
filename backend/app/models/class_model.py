from sqlalchemy import Column, String
from .base_model import Base, TimestampMixin

class Class(Base, TimestampMixin):
    __tablename__ = "classes"

    name = Column(String(50), nullable=False, unique=True, index=True)
