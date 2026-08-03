import time
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config.settings import settings

security = HTTPBearer()


def verify_appid_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    token = credentials.credentials

    try:
        # Developer mode
        if token == "mock-dev-token":
            if settings.DEBUG or not settings.APP_ID_CLIENT_ID:
                return {
                    "sub": "mock-user-123",
                    "name": "Developer Mode",
                    "email": "dev@local.host",
                }

        # Decode JWT without signature verification (debug)
        decoded = jwt.decode(
            token,
            options={"verify_signature": False},
        )

        # Verify expiration
        if "exp" in decoded and decoded["exp"] < time.time():
            raise HTTPException(
                status_code=401,
                detail="IBM App ID token has expired",
            )

        # Verify audience
        aud = decoded.get("aud")

        if settings.APP_ID_CLIENT_ID:
            if isinstance(aud, list):
                if settings.APP_ID_CLIENT_ID not in aud:
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid IBM App ID token audience",
                    )
            elif aud != settings.APP_ID_CLIENT_ID:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid IBM App ID token audience",
                )

        return decoded

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired IBM App ID token: {str(e)}",
        )
