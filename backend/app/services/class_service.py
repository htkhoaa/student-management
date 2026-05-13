from sqlalchemy.orm import Session
from app.repositories.class_repo import ClassRepository

class ClassService:
    def __init__(self, db: Session):
        self.repo = ClassRepository(db)

    def get_all_classes(self):
        return self.repo.get_all()