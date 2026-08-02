import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Task Manager API")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

    CLOUDANT_URL: str = os.getenv("CLOUDANT_URL", "")
    CLOUDANT_API_KEY: str = os.getenv("CLOUDANT_API_KEY", "")
    CLOUDANT_DATABASE: str = os.getenv("CLOUDANT_DATABASE", "task_manager")

    # IBM App ID Configuration 
    APP_ID_TENANT_ID: str = os.getenv("APP_ID_TENANT_ID", "")
    APP_ID_CLIENT_ID: str = os.getenv("APP_ID_CLIENT_ID", "")
    APP_ID_SECRET: str = os.getenv("APP_ID_SECRET", "")
    APP_ID_SERVER_URL: str = os.getenv("APP_ID_SERVER_URL", "")

    ALLOWED_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "https://task-manager-1-b2lj.onrender.com/,https://task-manager-six-omega-18.vercel.app/").split(",")
        if origin.strip()
    ]

settings = Settings()
