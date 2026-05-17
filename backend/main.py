import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.exceptions.handler import register_exception_handlers

def create_app() -> FastAPI:

    app = FastAPI(
        title="Student Management System",
        version="1.0.0",
        description="Backend API for Student Management"
    )

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
