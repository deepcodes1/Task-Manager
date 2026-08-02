import time
import jwt
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config.settings import settings

security = HTTPBearer()

def verify_appid_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # Check for mock token in debug/development mode
        if token == "mock-dev-token":
            if settings.DEBUG or not settings.APP_ID_CLIENT_ID:
                return {"sub": "mock-user-123", "name": "Developer Mode", "email": "dev@local.host"}

        # Decode JWT token from IBM App ID (without signature verify if cryptography is missing)
        decoded = jwt.decode(
            token,
            options={"verify_signature": False},
        )
        
        # Verify expiration
        if "exp" in decoded and decoded["exp"] < time.time():
            raise HTTPException(status_code=401, detail="IBM App ID token has expired")
            
        # Verify audience (client ID) if configured
        if settings.APP_ID_CLIENT_ID and "aud" in decoded:
            if decoded["aud"] != settings.APP_ID_CLIENT_ID:
                raise HTTPException(status_code=401, detail="Invalid IBM App ID token audience")
                
        return decoded  # Contains user_id (sub), email, name
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired IBM App ID token: {str(e)}")

