from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from .base import AppException
from .error_code import ErrorCode

def register_exception_handlers(app: FastAPI):

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return create_error_response(
            request,
            code=exc.error_code.code,
            message=exc.error_code.message,
            status_code=exc.error_code.status_code
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return create_error_response(
            request,
            code=ErrorCode.VALIDATION_ERROR.code,
            message=ErrorCode.VALIDATION_ERROR.message,
            status_code=422,
            details=exc.errors()
        )

    @app.exception_handler(Exception)
    async def universal_exception_handler(request: Request, exc: Exception):
        return create_error_response(
            request,
            code=ErrorCode.UNCATEGORIZED_EXCEPTION.code,
            message=ErrorCode.UNCATEGORIZED_EXCEPTION.message,
            status_code=500
        )


def create_error_response(request: Request, code: int, message: str, status_code: int, details=None):
    content = {
        "code": code,
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "path": request.url.path
    }
    if details:
        content["details"] = details
    return JSONResponse(status_code=status_code, content=content)
