from .error_code import ErrorCode
from typing import overload, Optional

class AppException(Exception):
    @overload
    def __init__(self, error_code: ErrorCode) -> None: ...

    @overload
    def __init__(self, error_code: ErrorCode, message: str) -> None: ...

    def __init__(self, error_code: ErrorCode, message: Optional[str] = None):
        """ Use custom message if provided, else default from error_code """
        custom_message = message if message is not None else error_code.message
        super().__init__(custom_message)
        self.error_code = error_code