from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.student_model import Student
from app.models.class_model import Class

class DashboardRepository:

    def get_class_distribution(self, db: Session):
        """ Return a list of classes with their respective student counts """
        return (
            db.query(
                Class.name.label("class_name"),
                func.count(Student.id).label("student_count")
            )
            .outerjoin(Student, Class.id == Student.class_id)
            .group_by(Class.id, Class.name)
            .all()
        )