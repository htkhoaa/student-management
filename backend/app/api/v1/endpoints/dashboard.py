from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardStats
from app.core.security import role_required
from app.models.constant import UserRole

router = APIRouter()
dashboard_service = DashboardService()

@router.get("/stats", response_model=DashboardStats, status_code=status.HTTP_200_OK)
def get_dashboard_stats(db: Session = Depends(get_db), current_admin = Depends(role_required([UserRole.ADMIN]))):
    res = dashboard_service.get_stats(db, admin_name = current_admin.username)
    print(res.get("total_students"))
    return dashboard_service.get_stats(db, admin_name = current_admin.username)