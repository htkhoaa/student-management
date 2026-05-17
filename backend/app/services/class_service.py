from typing import List
from sqlalchemy.orm import Session
from app.models import User
from app.repositories.class_repo import ClassRepository
from app.exceptions.base import AppException, ErrorCode
from app.repositories.student_repo import StudentRepository
from app.schemas.student import StudentResponse

DEFAULT_CLASS_NAME = "Unassigned"


class ClassService:
    def __init__(self, db: Session):
        self.repo = ClassRepository(db)
        self.student_repo = StudentRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_my_class_members(self, current_user: User) -> List[StudentResponse]:
        if not current_user.student:
            raise AppException(ErrorCode.STUDENT_NOT_FOUND)

        my_class_id = current_user.student.class_id

        students = self.student_repo.get_students_by_class(my_class_id)

        return [
            StudentResponse(
                id=s.id,
                full_name=s.full_name,
                email=s.email,
                gender=s.gender,
                phone=s.phone,
                class_id=s.class_id,
                class_name=s.student_class.name if s.student_class else DEFAULT_CLASS_NAME,
                username=s.user.username if s.user else None,
                is_active=s.user.is_active if s.user else True
            ) for s in students
        ]

