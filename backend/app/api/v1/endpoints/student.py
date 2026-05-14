from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.security import role_required
from typing import Optional
from app.schemas.student import StudentCreateRequest, StudentResponse, StudentPaginationResponse
from app.services.student_service import StudentService
from app.db.session import get_db
from app.models.user_model import User
from app.models.constant import UserRole

router = APIRouter()


@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create(payload: StudentCreateRequest, db: Session = Depends(get_db),
           current_user: User = Depends(role_required([UserRole.ADMIN]))):
    service = StudentService(db)
    return service.create(payload)


@router.get("/", response_model=StudentPaginationResponse)
def get_all(
        skip: int = Query(0, ge=0, description="Number of records to skip"),
        limit: int = Query(100, ge=1, le=100, description="Max number of records to return"),
        class_id: Optional[int] = Query(None, description="Filter students by Class ID"),
        is_active: Optional[bool] = Query(None, description="Filter students by account status"),
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required([UserRole.ADMIN]))):
    service = StudentService(db)
    return service.get_all(skip=skip, limit=limit, class_id=class_id, is_active=is_active)


@router.get("/{id}", response_model=StudentResponse)
def get_by_id(id: int, db: Session = Depends(get_db),
              current_user: User = Depends(role_required([UserRole.ADMIN]))):
    service = StudentService(db)
    return service.get_by_id(id)
