from __future__ import annotations

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from app.models.student_model import Student
from app.models.user_model import User
from app.models.class_model import Class

class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_with_account(self, student_data: dict, user_data: dict) -> Student:
        """Directly interacts with DB models to create both Student and User records"""
        # Step A: Insert Student record
        new_student = Student(**student_data)
        self.db.add(new_student)
        self.db.flush()  # Acquire new_student.id immediately

        # Step B: Insert User record linked to the new student
        user_data["student_id"] = new_student.id
        new_user = User(**user_data)
        self.db.add(new_user)

        # Step C: Commit package safely
        self.db.commit()
        self.db.refresh(new_student)
        return new_student

    def get_username_by_id(self, student_id: int) -> Optional[str]:
        """ Fetch username directly using scalar """
        stmt = select(User.username).where(User.student_id == student_id)
        return self.db.scalars(stmt).first()

    def get_all_with_username(
        self,
        skip: int = 0,
        limit: int = 100,
        class_id: Optional[int] = None,
        is_active: Optional[bool] = None
    ) -> List[Student]:
        """ Fetch students with pagination, optional class_id and status filters """
        stmt = (
            select(
                Student,
                User.username,
                User.is_active,
                Class.name.label("name")
            )
            .outerjoin(User, User.student_id == Student.id)
            .outerjoin(Class, Class.id == Student.class_id)
        )

        # Apply class_id filter if provided
        if class_id is not None:
            stmt = stmt.where(Student.class_id == class_id)

        # Apply is_active filter if provided
        if is_active is not None:
            stmt = stmt.where(User.is_active == is_active)

        # Apply pagination
        stmt = stmt.offset(skip).limit(limit)
        results = self.db.execute(stmt).all()

        students = []
        for student, username, active_status, class_name in results:
            student.username = username
            student.class_name = class_name if class_name else "Unassigned"
            student.is_active = active_status if active_status is not None else True
            students.append(student)

        return students

    def get_by_id(self, student_id: int) -> Optional[Student]:
        """
        Find a student by their unique ID
        Returns None if the linked user account is inactive
        """

        stmt = (
            select(Student)
            .join(User, User.student_id == Student.id)
            .where(Student.id == student_id, User.is_active == True)
        )
        return self.db.scalars(stmt).first()

    def get_latest_username(self) -> Optional[str]:
        """ Get the highest student username (MSSV) starting with '12323' """
        # Query the username column, sort descending to get the highest numeric code
        result = self.db.query(User.username) \
            .filter(User.username.like("12323%")) \
            .order_by(User.username.desc()) \
            .first()

        # Return the string username if exists, otherwise None
        return result[0] if result else None

    def delete(self, student: Student) -> None:
        """
        Soft delete a student by deactivating their linked user account.
        """
        stmt = (
            update(User)
            .where(User.student_id == student.id)
            .values(is_active=False)
        )
        self.db.execute(stmt)