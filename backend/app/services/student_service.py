from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.student_model import Student
from app.models.user_model import User
from app.models.constant import UserRole
from app.schemas.student import StudentCreateRequest, StudentUpdateRequest
from app.repositories.student_repo import StudentRepository
from app.core.security import get_password_hash
from app.exceptions.error_code import ErrorCode
from app.exceptions.base import AppException
from app.models.class_model import Class

class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.student_repo = StudentRepository(db)

    def _generate_next_student_id_number(self) -> str:
        """Auto-generate next student code (MSSV) based on current max value."""
        latest_username = self.student_repo.get_latest_username()

        if latest_username and latest_username.isdigit():
            return str(int(latest_username) + 1)
        return "123230001"

    def create(self, payload: StudentCreateRequest) -> Student:
        """Create a new student and auto-generate a linked User account."""
        mssv = self._generate_next_student_id_number()
        email = f"{mssv}@dut.edu.vn"
        student_data = {
            "full_name": payload.full_name,
            "email": email,
            "gender": payload.gender,
            "phone": payload.phone,
            "class_id": payload.class_id
        }
        user_data = {
            "username": mssv,
            "email": email,
            "password_hash": get_password_hash("student"),
            "role": UserRole.STUDENT,
            "is_active": True
        }
        try:
            new_student = self.student_repo.create_with_account(
                student_data=student_data,
                user_data=user_data
            )

            return self._attach_relations(new_student, current_username=mssv, current_active=True)
        except Exception as e:
            self.db.rollback()
            raise AppException(ErrorCode.INTERNAL_SERVER_ERROR, f"Failed to create student package: {str(e)}")

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        class_id: Optional[int] = None,
        is_active: Optional[bool] = None
    ) -> List[Student]:
        """Get list of all students with pagination and filters applied."""
        # Forward filters directly to the updated repository method
        return self.student_repo.get_all_with_username(
            skip=skip,
            limit=limit,
            class_id=class_id,
            is_active=is_active
        )

    def get_by_id(self, student_id: int) -> Student:
        """Get single student details by ID."""
        student = self.student_repo.get_by_id(student_id)
        if not student:
            raise AppException(ErrorCode.STUDENT_NOT_FOUND)

        return self._attach_relations(student)

    def update_student(self, student_id: int, payload: StudentUpdateRequest) -> Student:
        """Update student profile details dynamically."""
        student = self.student_repo.get_by_id(student_id)
        if not student:
            raise AppException(ErrorCode.STUDENT_NOT_FOUND)

        # Extract only provided update fields
        student_patch_data = payload.model_dump(exclude_unset=True)

        try:
            for key, value in student_patch_data.items():
                setattr(student, key, value)

            self.db.commit()
            self.db.refresh(student)

            return self._attach_relations(student)

        except Exception as e:
            self.db.rollback()
            raise AppException(ErrorCode.INTERNAL_SERVER_ERROR, f"Failed to update student: {str(e)}")

    def delete(self, student_id: int) -> None:
        """Delete student profile. Linked user updates via migration rules."""
        student = self.student_repo.get_by_id(student_id)
        if not student:
            raise AppException(ErrorCode.STUDENT_NOT_FOUND)

        try:
            self.student_repo.delete(student)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise AppException(ErrorCode.INTERNAL_SERVER_ERROR, f"Failed to delete student: {str(e)}")

    # =========================================================================
    # HELPER METHODS
    # =========================================================================
    def _attach_relations(self, student: Student, current_username: str = None, current_active: bool = None) -> Student:
        """Fetch and attach username, class_name, and active status to a student object."""
        if not student:
            return student

        # 1. Map Username (Use memory argument if available; otherwise, query repository)
        student.username = current_username if current_username else self.student_repo.get_username_by_id(
            student.id)

        # 2. Map Active Status (Use memory argument if available; otherwise, query database)
        if current_active is not None:
            student.is_active = current_active
        else:
            is_active_status = self.db.query(User.is_active).where(User.student_id == student.id).scalar()
            student.is_active = is_active_status if is_active_status is not None else True

        # 3. Map Real Class Name text based on object class_id
        actual_class_name = self.db.query(Class.name).where(Class.id == student.class_id).scalar()
        student.class_name = actual_class_name if actual_class_name else "Unassigned"

        return student
