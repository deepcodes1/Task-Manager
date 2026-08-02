import uuid
from datetime import datetime, timezone

def generate_uuid() -> str:
    """Generate a unique UUID string for task IDs."""
    return str(uuid.uuid4())

def get_utc_timestamp() -> str:
    """Get current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).isoformat()

def clean_dict(data: dict) -> dict:
    """Remove None values from dictionary."""
    return {k: v for k, v in data.items() if v is not None}
