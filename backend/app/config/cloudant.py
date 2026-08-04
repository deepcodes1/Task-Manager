from typing import Optional
from ibmcloudant.cloudant_v1 import CloudantV1
try:
    from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
except ImportError:
    from ibm_cloud_sdk_core.authenticators import IamAuthenticator as IAMAuthenticator
from app.config.settings import settings
from app.utils.logger import logger

class CloudantManager:
    """IBM Cloudant NoSQL Database Connection Manager."""

    def __init__(self):
        self.client: Optional[CloudantV1] = None
        self.db_name: str = settings.CLOUDANT_DATABASE
        self._initialize_connection()

    def _initialize_connection(self):
        """Initialize IBM Cloudant client using IamAuthenticator."""
        url = settings.CLOUDANT_URL
        api_key = settings.CLOUDANT_API_KEY

        if not url or not api_key:
            logger.warning("Cloudant URL or API key not configured. Running in offline/fallback mode.")
            return

        try:
            authenticator = IAMAuthenticator(apikey=api_key)
            self.client = CloudantV1(authenticator=authenticator)
            self.client.set_service_url(url)
            logger.info("Successfully initialized IBM Cloudant client connection.")

            # Ensure Database Exists        
            self._ensure_database_exists()
        except Exception as e:
            logger.error(f"Failed to initialize IBM Cloudant client: {str(e)}")
            self.client = None

    def _ensure_database_exists(self):
        """Create the target database if it does not already exist."""
        if not self.client:
            return

        try:
            self.client.get_database_information(db=self.db_name).get_result()
            logger.info(f"IBM Cloudant database '{self.db_name}' ready.")
        except Exception:
            try:
                self.client.put_database(db=self.db_name).get_result()
                logger.info(f"Created IBM Cloudant database '{self.db_name}'.")
            except Exception as create_err:
                logger.error(f"Failed to create Cloudant database '{self.db_name}': {str(create_err)}")

cloudant_manager = CloudantManager()
