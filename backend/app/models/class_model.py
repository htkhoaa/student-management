from sqlalchemy import Column, String
from .base_model import Base, TimestampMixin
from sqlalchemy.orm import relationship

class Class(Base, TimestampMixin):
    __tablename__ = "classes"
    name = Column(String(50), nullable=False, unique=True, index=True)

    students = relationship("Student", back_populates="student_class")