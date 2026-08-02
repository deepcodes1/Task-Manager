from fastapi import FastAPI
from app.config.settings import settings
from app.routes.task_routes import router as task_router
from app.routes.auth_routes import router as auth_router
from app.middleware.cors import setup_cors
from app.middleware.logging_middleware import RequestLoggingMiddleware
from app.middleware.exception_handler import setup_exception_handlers
from app.utils.responses import success_response

def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        description="Cloud-Powered Task Manager REST API backed by IBM Cloudant NoSQL Database",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # 1. Setup CORS
    setup_cors(app)

    # 2. Add Request Logging Middleware
    app.add_middleware(RequestLoggingMiddleware)

    # 3. Setup Global Exception Handlers
    setup_exception_handlers(app)

    # 4. Include Routers
    app.include_router(auth_router)
    app.include_router(task_router)

    # 5. Root Health Check Endpoint
    @app.get("/", tags=["Health Check"])
    def root():
        return success_response(
            message="Welcome to Cloud-Powered Task Manager REST API",
            data={
                "name": settings.APP_NAME,
                "status": "online",
                "database": "IBM Cloudant NoSQL",
                "docs": "/docs"
            }
        )

    return app

app = create_app()
