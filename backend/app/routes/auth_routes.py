import base64
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config.settings import settings
from app.utils.logger import logger

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class TokenExchangeRequest(BaseModel):
    code: str
    redirect_uri: str

@router.post("/token")
async def exchange_token(payload: TokenExchangeRequest):
    """Securely exchange OIDC Authorization Code for Access & ID Tokens."""
    if not settings.APP_ID_SERVER_URL or not settings.APP_ID_CLIENT_ID or not settings.APP_ID_SECRET:
        logger.error("IBM App ID server credentials are not fully configured in settings.")
        raise HTTPException(
            status_code=500,
            detail="IBM App ID configurations are incomplete on the backend server."
        )

    token_url = f"{settings.APP_ID_SERVER_URL}/token"
    
    # Encode client_id:client_secret for Basic Authorization
    credentials = f"{settings.APP_ID_CLIENT_ID}:{settings.APP_ID_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "authorization_code",
        "code": payload.code,
        "redirect_uri": payload.redirect_uri
    }

    logger.info(f"Sending token exchange request to IBM App ID endpoint: {token_url}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(token_url, data=data, headers=headers, timeout=10.0)
            
            if response.status_code != 200:
                logger.error(f"IBM App ID token exchange failed. Status: {response.status_code}, Response: {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"IBM App ID authorization server error: {response.text}"
                )
                
            logger.info("Successfully completed token exchange with IBM App ID.")
            return response.json()
            
        except httpx.RequestError as exc:
            logger.error(f"Network error during connection to IBM App ID: {str(exc)}")
            raise HTTPException(
                status_code=503,
                detail=f"Unable to connect to IBM App ID authorization server: {str(exc)}"
            )
