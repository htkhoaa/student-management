from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.class_schema import ClassResponse
from app.services.class_service import ClassService
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_model=list[ClassResponse], summary="Get list of classes for dropdown")
def get_classes(db: Session = Depends(get_db)):
    service = ClassService(db)
    return service.get_all_classes()