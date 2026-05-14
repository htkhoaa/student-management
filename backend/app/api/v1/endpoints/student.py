from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.security import role_required
from app.models import User
from app.models.constant import UserRole
from app.schemas.student import StudentCreateRequest, StudentResponse
from app.services.student_service import StudentService
from app.db.session import get_db

router = APIRouter()


@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create(payload: StudentCreateRequest, db: Session = Depends(get_db),
            current_user: User = Depends(role_required([UserRole.ADMIN]))):
    service = StudentService(db)
    return service.create(payload)
