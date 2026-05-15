from __future__ import annotations
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from sqlalchemy import select, func, update
from app.models.student_model import Student
from app.models.user_model import User

STUDENT_CODE_PATTERN = "12323%"
DEFAULT_CLASS_NAME = "Unassigned"


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
        query = select(User.username).where(User.student_id == student_id)
        return self.db.scalars(query).first()

    def get_by_id(self, student_id: int) -> Optional[Student]:
        return self.db.get(Student, student_id)

    def get_student_by_username(self, username: str) -> Optional[Student]:
        query = (
            select(Student)
            .options(
                joinedload(Student.user),
                joinedload(Student.student_class)
            )
            .join(User, User.student_id == Student.id)
            .where(User.username == username)
        )
        return self.db.scalars(query).first()

    def get_all_with_details(
            self, skip: int, limit: int, class_id: Optional[int], is_active: Optional[bool]
    ) -> List[Student]:
        query = (select(Student).options(
            joinedload(Student.user),
            joinedload(Student.student_class)
        ).outerjoin(User, User.student_id == Student.id))

        if class_id is not None:
            query = query.where(Student.class_id == class_id)
        if is_active is not None:
            query = query.where(User.is_active == is_active)

        return self.db.scalars(query.offset(skip).limit(limit)).unique().all()

    def count_all(self, class_id: Optional[int], is_active: Optional[bool]) -> int:
        query = select(func.count(Student.id)).outerjoin(User, User.student_id == Student.id)
        if class_id is not None:
            query = query.where(Student.class_id == class_id)
        if is_active is not None:
            query = query.where(User.is_active == is_active)
        return self.db.execute(query).scalar() or 0

    def get_student_profile(self, student_id: int):
        query = (
            select(Student)
            .options(
                joinedload(Student.user),
                joinedload(Student.student_class)
            )
            .where(Student.id == student_id)
        )
        return self.db.scalars(query).first()

    def get_latest_username(self) -> Optional[str]:
        query = (
            select(User.username)
            .where(User.username.like(STUDENT_CODE_PATTERN))
            .order_by(User.username.desc())
        )
        return self.db.scalars(query).first()

    def delete(self, student: Student) -> None:
        if student.user:
            student.user.is_active = False
        self.db.add(student)
        self.db.commit()

    def get_students_by_class(self, class_id: int) -> List[Student]:
        query = (
            select(Student)
            .join(Student.user)  # Cần join để lọc theo User.is_active
            .options(
                joinedload(Student.user),
                joinedload(Student.student_class)
            )
            .where(
                Student.class_id == class_id,
                User.is_active == True  # Lọc điều kiện bên bảng User
            )
        )
        return self.db.scalars(query).unique().all()
