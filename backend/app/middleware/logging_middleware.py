import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.logger import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """ASGI Middleware to log incoming HTTP request details and duration."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_ip = request.client.host if request.client else "unknown"
        method = request.method
        url = str(request.url.path)

        logger.info(f"Incoming request: {method} {url} from {client_ip}")

        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            logger.info(
                f"Completed: {method} {url} - Status: {response.status_code} in {process_time:.2f}ms"
            )
            return response
        except Exception as exc:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"Failed: {method} {url} after {process_time:.2f}ms - Error: {str(exc)}"
            )
            raise exc
