from sqlalchemy.orm import Session
from app.repositories.dashboard_repo import DashboardRepository

class DashboardService:
    def __init__(self):
        self.repo = DashboardRepository()

    def get_stats(self, db: Session, admin_name: str):
        distribution = self.repo.get_class_distribution(db)
        total_classes = len(distribution)
        total_students = sum(row.student_count for row in distribution)

        return {
            "admin_name": admin_name,
            "total_students": total_students,
            "total_classes": total_classes,
            "class_distribution": distribution
        }