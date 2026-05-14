from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.security import role_required
from app.models import User
from app.models.constant import UserRole
from app.schemas.class_schema import ClassResponse
from app.schemas.student import StudentResponse
from app.services.class_service import ClassService
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=list[ClassResponse])
def get_classes(db: Session = Depends(get_db)):
    service = ClassService(db)
    return service.get_all()


@router.get("/myClass", response_model=List[StudentResponse])
def get_my_class_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.STUDENT]))
):
    service = ClassService(db)
    return service.get_my_class_members(current_user)