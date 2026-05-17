from app.db.session import SessionLocal
from app.models.user_model import User
from app.core.security import get_password_hash
from app.models.constant import UserRole

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"
STUDENT_USERNAME = "student"
STUDENT_PASSWORD = "student"


def seed_data():
    print("🚀 Start running seed_data() ")
    db = SessionLocal()
    try:
        # 1. Seed Admin for testing API Login
        if not db.query(User).filter(User.username == ADMIN_USERNAME).first():
            admin = User(
                username=ADMIN_USERNAME,
                password_hash=get_password_hash(ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                email=f"{ADMIN_USERNAME}@school.edu",
                student_id=None,
                is_active=True
            )
            db.add(admin)

        # 2. Seed Student for testing API Login
        if not db.query(User).filter(User.username == STUDENT_USERNAME).first():
            student = User(
                username=STUDENT_USERNAME,
                password_hash=get_password_hash(STUDENT_PASSWORD),
                email=f"{STUDENT_USERNAME}@school.edu",
                role=UserRole.STUDENT,
                student_id=None,
                is_active=True
            )
            db.add(student)

        db.commit()
        print("✅ Seeded Admin and Student successfully")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()