from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, DateTime, func

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    __abstract__ = True
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
