import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.seeder import run_seed
from app.models.base_model import Base
from app.db.session import engine

from app.api.v1.api import api_router
from app.exceptions.handler import register_exception_handlers

def create_app() -> FastAPI:

    app = FastAPI(
        title="Student Management System",
        version="1.0.0",
        description="Backend API for Student Management"
    )

    @app.on_event("startup")
    def setup_database_and_seeder():
        import time
        from sqlalchemy.exc import OperationalError

        print("--- [DB SETUP] Connecting to database... ---")

        # Retry loop to handle delayed database container startup
        retries = 10
        while retries > 0:
            try:
                # Generate all missing tables from SQLAlchemy models
                Base.metadata.create_all(bind=engine)
                print("--- [DB SETUP] Database connected and tables generated! ---")
                break
            except OperationalError:
                retries -= 1
                print(f"--- [DB SETUP] Database not ready ({retries} retries left). Retrying in 2s... ---")
                time.sleep(2)

        # Halt execution if connection completely fails after all retries
        if retries == 0:
            print("--- [DB SETUP] CRITICAL: Database connection failed. ---")
            return

        print("--- [DB SETUP] Executing database seeder script... ---")
        try:
            run_seed(engine)
            print("--- [DB SETUP] Database seeded successfully! ---")
        except Exception as e:
            # Prevent app crash if data already exists or constraints conflict
            print(f"--- [DB SETUP] Seeding bypassed or failed: {str(e)} ---")

    # 1. Register Global Exception Handlers
    register_exception_handlers(app)

    # 2. Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 3. Register V1 API Router
    # All routes will start with /api/v1
    app.include_router(api_router, prefix="/api/v1")

    return app

app = create_app()
# Run server with uvicorn (only for development)
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
