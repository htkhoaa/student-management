from __future__ import annotations
from typing import Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.models.student_model import Student
from app.models.user_model import User

STUDENT_CODE_PATTERN = "12323%"


class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_with_account(self, student: dict, user: dict) -> Student:
        new_student = Student(**student)
        self.db.add(new_student)
        self.db.flush()

        user["student_id"] = new_student.id
        new_user = User(**user)
        self.db.add(new_user)

        self.db.commit()
        self.db.refresh(new_student)
        return new_student

    def get_username_by_id(self, student_id: int) -> Optional[str]:
        stmt = select(User.username).where(User.student_id == student_id)
        return self.db.scalars(stmt).first()

    def get_student_profile(self, student_id: int) -> Optional[Student]:
        stmt = (
            select(Student)
            .options(
                joinedload(Student.user),
                joinedload(Student.student_class)
            )
            .where(Student.id == student_id)
        )
        return self.db.scalars(stmt).first()

    def get_latest_username(self) -> Optional[str]:
        stmt = (
            select(User.username)
            .where(User.username.like(STUDENT_CODE_PATTERN))
            .order_by(User.username.desc())
        )
        return self.db.scalars(stmt).first()
