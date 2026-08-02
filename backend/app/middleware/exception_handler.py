from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from app.utils.responses import error_response
from app.utils.logger import logger

def setup_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers for FastAPI application."""

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Format Pydantic request validation errors into unified JSON response."""
        error_details = []
        for err in exc.errors():
            loc = " -> ".join([str(x) for x in err.get("loc", [])])
            msg = err.get("msg", "Invalid value")
            error_details.append(f"{loc}: {msg}")

        message = error_details[0] if error_details else "Validation error"
        logger.warning(f"Validation error on {request.method} {request.url.path}: {message}")
        return error_response(
            message=message,
            status_code=422,
            errors=error_details
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Format HTTP status exceptions."""
        logger.warning(f"HTTPException [{exc.status_code}] on {request.url.path}: {exc.detail}")
        return error_response(
            message=str(exc.detail),
            status_code=exc.status_code
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """Catch-all for unhandled internal exceptions."""
        logger.error(f"Unhandled Internal Error on {request.url.path}: {str(exc)}", exc_info=True)
        return error_response(
            message="An internal server error occurred",
            status_code=500
        )
