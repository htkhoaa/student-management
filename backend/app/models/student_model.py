from sqlalchemy import Column, String, ForeignKey, Enum, Integer
from .base_model import Base, TimestampMixin
from .constant import GenderType


class Student(Base, TimestampMixin):
    __tablename__ = "students"

    full_name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    gender = Column(Enum(GenderType), nullable=False, default=GenderType.MALE)
    phone = Column(String(20), nullable=True)

    class_id = Column(Integer, ForeignKey("classes.id", ondelete="RESTRICT"), nullable=False)
