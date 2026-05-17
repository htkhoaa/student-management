from sqlalchemy.orm import Session
from app.models.class_model import Class

class ClassRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Class).all()