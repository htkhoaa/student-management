from enum import Enum
from starlette import status

class ErrorCode(Enum):

    UNAUTHENTICATED = (1001, "Invalid username or password", status.HTTP_401_UNAUTHORIZED)
    UNAUTHORIZED = (1002, "You do not have permission to access this resource", status.HTTP_403_FORBIDDEN)

    STUDENT_NOT_FOUND = (2001, "Student not found", status.HTTP_404_NOT_FOUND)
    USER_NOT_FOUND = (2002, "User not found", status.HTTP_404_NOT_FOUND)
    STUDENT_EXISTED = (2003, "Student ID already exists", status.HTTP_400_BAD_REQUEST)

    INVALID_TOKEN = (4000, "Invalid or expired token", status.HTTP_401_UNAUTHORIZED)
    CREDENTIALS_VALIDATION_FAILED = (4001, "Could not validate credentials", status.HTTP_401_UNAUTHORIZED)

    UNCATEGORIZED_EXCEPTION = (9999, "Uncategorized system error", status.HTTP_500_INTERNAL_SERVER_ERROR)
    VALIDATION_ERROR = (8888, "Invalid input data", status.HTTP_422_UNPROCESSABLE_ENTITY)

    INTERNAL_SERVER_ERROR = (5555, "Error System", status.HTTP_500_INTERNAL_SERVER_ERROR)

    def __init__(self, code, message, status_code):
        self.code = code
        self.message = message
        self.status_code = status_code