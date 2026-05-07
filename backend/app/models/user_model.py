from sqlalchemy import Column, String, ForeignKey, Enum, Boolean, Integer
from .base_model import Base, TimestampMixin
from .constant import UserRole


class User(Base, TimestampMixin):
    __tablename__ = "users"

    username = Column(String(50), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="SET NULL"), unique=True, nullable=True)
