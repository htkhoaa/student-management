from sqlalchemy.orm import Session
from app.models.student_model import STUDENT_ACTIVE
from app.models.constant import UserRole
from app.schemas.student import StudentCreateRequest
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

    def _generate_next_student_id_number(self) -> str:
        latest_username = self.student_repo.get_latest_username()

        if latest_username and latest_username.isdigit():
            return str(int(latest_username) + 1)
        return DEFAULT_STUDENT_CODE

    def create(self, payload: StudentCreateRequest) -> StudentResponse:
        student_code = self._generate_next_student_id_number()
        email = f"{student_code}@dut.edu.vn"

        student = {
            "full_name": payload.full_name,
            "email": email,
            "gender": payload.gender,
            "phone": payload.phone,
            "class_id": payload.class_id
        }
        user = {
            "username": student_code,
            "email": email,
            "password_hash": get_password_hash(DEFAULT_STUDENT_PASSWORD),
            "role": UserRole.STUDENT,
            "is_active": STUDENT_ACTIVE
        }
        try:
            new_student = self.student_repo.create_with_account(student=student, user=user)

            student_profile = self.student_repo.get_student_profile(new_student.id)

            if not student_profile:
                raise AppException(ErrorCode.STUDENT_NOT_FOUND, "Record not found")

            return StudentResponse(
                id=student_profile.id,
                full_name=student_profile.full_name,
                email=student_profile.email,
                gender=student_profile.gender,
                phone=student_profile.phone,
                class_id=student_profile.class_id,
                class_name=student_profile.student_class.name if student_profile.student_class else DEFAULT_CLASS_NAME,
                username=student_profile.user.username if student_profile.user else student_code,
                is_active=student_profile.user.is_active if student_profile.user else STUDENT_ACTIVE
            )

        except Exception as e:
            self.db.rollback()
            raise AppException(ErrorCode.INTERNAL_SERVER_ERROR, f"Failed to create student package: {str(e)}")
