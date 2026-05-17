from pydantic import BaseModel
from typing import List

class ClassDistribution(BaseModel):
    class_name: str
    student_count: int

class DashboardStats(BaseModel):
    admin_name: str
    total_students: int
    total_classes: int
    class_distribution: List[ClassDistribution]