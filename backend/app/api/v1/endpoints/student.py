from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.student import StudentCreateRequest, StudentUpdateRequest, StudentResponse
from app.services.student_service import StudentService
from app.db.session import get_db
from app.models.user_model import User
from app.core.security import role_required
from app.models.constant import UserRole

router = APIRouter()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATE)
def create(payload: StudentCreateRequest, db: Session = Depends(get_db),
                   current_user: User = Depends(role_required([UserRole.ADMIN]))):
    """ Create a new student and automatically generate their user account """
    service = StudentService(db)
    return service.create(payload)


@router.get("/", response_model=List[StudentResponse])
def get_all(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Max number of records to return"),
    class_id: Optional[int] = Query(None, description="Filter students by Class ID"),
    is_active: Optional[bool] = Query(None, description="Filter students by account status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required([UserRole.ADMIN]))
):
    """ Fetch all students with pagination and optional filters """
    service = StudentService(db)
    # Forward the filters down to the service layer
    return service.get_all(skip=skip, limit=limit, class_id=class_id, is_active=is_active)


@router.get("/{id}", response_model=StudentResponse)
def get_by_id(student_id: int, db: Session = Depends(get_db),
                      current_user: User = Depends(role_required([UserRole.ADMIN]))):
    """ Get single active student profile details by ID """
    service = StudentService(db)
    return service.get_by_id(student_id)


@router.put("/{id}", response_model=StudentResponse)
def update(student_id: int, payload: StudentUpdateRequest, db: Session = Depends(get_db),
                   current_user: User = Depends(role_required([UserRole.ADMIN]))):
    """ Update active student profile fields dynamically """
    service = StudentService(db)
    return service.update_student(student_id, payload)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(role_required([UserRole.ADMIN]))):
    """ Soft delete a student profile by deactivating their linked user account """
    service = StudentService(db)
    service.delete(student_id)
    return None
