from typing import Any, Optional
from fastapi.responses import JSONResponse

def success_response(
    message: str = "Operation successful",
    data: Optional[Any] = None,
    status_code: int = 200
) -> JSONResponse:
    """Build standardized success JSON response."""
    payload = {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }
    return JSONResponse(status_code=status_code, content=payload)

def error_response(
    message: str = "An error occurred",
    status_code: int = 400,
    errors: Optional[Any] = None
) -> JSONResponse:
    """Build standardized error JSON response."""
    payload = {
        "success": False,
        "message": message,
    }
    if errors is not None:
        payload["errors"] = errors
    return JSONResponse(status_code=status_code, content=payload)
