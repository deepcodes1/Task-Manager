from typing import Optional, Any
from pydantic import BaseModel, Field, field_validator
from app.utils.constants import ALLOWED_TASK_STATUSES

class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=3, max_length=100, description="Task title is required (3-100 chars)")
    description: str = Field(..., min_length=1, max_length=500, description="Task description is required")
    status: str = Field("Pending", description="Task status: Pending, In Progress, Completed")

    @field_validator("status")

    def validate_status(cls, value: str) -> str:
        if value not in ALLOWED_TASK_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(ALLOWED_TASK_STATUSES)}")
        return value

    @field_validator("title", "description")

    def validate_non_empty(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Field cannot be empty or contain only whitespace")
        return value.strip()

class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    status: Optional[str] = Field(None)

    @field_validator("status")

    def validate_status(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and value not in ALLOWED_TASK_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(ALLOWED_TASK_STATUSES)}")
        return value

    @field_validator("title", "description")

    def validate_non_empty(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and (not value or not value.strip()):
            raise ValueError("Field cannot be empty or contain only whitespace")
        return value.strip() if value else None

class TaskResponse(BaseModel):
    """Schema for returning task details."""
    id: str
    title: str
    description: str
    status: str
    created_at: str
    updated_at: str
    _id: Optional[str] = None
    _rev: Optional[str] = None

class APIResponse(BaseModel):
    """Unified API response wrapper."""
    success: bool
    message: str
    data: Optional[Any] = None
