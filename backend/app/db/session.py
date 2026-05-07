from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.core.config import settings

# Create database engine with connection pooling
# pool_pre_ping: checks connection health before use
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Factory for creating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to provide a database session per request
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db  # Provides session to the controller
    finally:
        db.close() # Ensures session is closed after request