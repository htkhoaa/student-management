from sqlalchemy.orm import Session
from app.models.student_model import Student, STUDENT_ACTIVE
from app.models.constant import UserRole
from app.schemas.student import StudentCreateRequest, StudentUpdateRequest
from app.repositories.student_repo import StudentRepository
from app.core.security import get_password_hash
from app.exceptions.error_code import ErrorCode
from app.exceptions.base import AppException
from app.schemas.student import StudentResponse

DEFAULT_STUDENT_PASSWORD = "student"
DEFAULT_STUDENT_CODE = "123230001"
DEFAULT_CLASS_NAME = "Unassigned"


class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.student_repo = StudentRepository(db)

    def _generate_next_student_code(self) -> str:
        latest = self.student_repo.get_latest_username()
        return str(int(latest) + 1) if latest and latest.isdigit() else DEFAULT_STUDENT_CODE

    def create(self, payload: StudentCreateRequest) -> StudentResponse:
        student_code = self._generate_next_student_code()
        email = f"{student_code}@dut.edu.vn"

        s_data = {**payload.dict(), "email": email}
        u_data = {
            "username": student_code, "email": email,
            "password_hash": get_password_hash(DEFAULT_STUDENT_PASSWORD),
            "role": UserRole.STUDENT, "is_active": STUDENT_ACTIVE
        }

        try:
            new_s = self.student_repo.create_with_account(s_data, u_data)
            return self._to_response(self.student_repo.get_student_profile(new_s.id))

        except Exception as e:
            self.db.rollback()
            raise AppException(ErrorCode.INTERNAL_SERVER_ERROR, f"Failed to create student package: {str(e)}")

    def get_all(self, skip: int = 0, limit: int = 20, **filters) -> dict:
        students = self.student_repo.get_all_with_details(skip, limit, **filters)
        total = self.student_repo.count_all(**filters)

        return {
            "items": [self._to_response(s) for s in students],
            "total": total,
            "skip": skip,
            "limit": limit
        }

    def get_by_id(self, s_id: int) -> StudentResponse:
        s = self.student_repo.get_student_profile(s_id)
        if not s: raise AppException(ErrorCode.STUDENT_NOT_FOUND)
        return self._to_response(s)

    def update(self, student_id: int, payload: StudentUpdateRequest) -> StudentResponse:
        student = self.student_repo.get_by_id(student_id)
        if not student:
            raise AppException(ErrorCode.STUDENT_NOT_FOUND)

        student_update = payload.model_dump(exclude_unset=True)

        try:
            for key, value in student_update.items():
                setattr(student, key, value)
            self.db.commit()

            updated_profile = self.student_repo.get_student_profile(student_id)
            return self._to_response(updated_profile)

        except Exception as e:
            self.db.rollback()
            raise AppException(ErrorCode.INTERNAL_SERVER_ERROR, f"Failed to update student: {str(e)}")

    def _to_response(self, student: Student) -> StudentResponse:
        return StudentResponse(
            id=student.id,
            full_name=student.full_name,
            email=student.email,
            gender=student.gender,
            phone=student.phone,
            class_id=student.class_id,

            class_name=student.student_class.name if student.student_class else DEFAULT_CLASS_NAME,
            username=student.user.username if student.user else None,
            is_active=student.user.is_active if student.user else True
        )
