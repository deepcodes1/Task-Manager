from typing import Optional
from pydantic import BaseModel

class TaskModel(BaseModel):
    """Domain model representing a Task document in IBM Cloudant."""
    id: str
    title: str
    description: str
    status: str
    created_at: str
    updated_at: str
    _id: Optional[str] = None
    _rev: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
