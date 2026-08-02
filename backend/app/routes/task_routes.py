from typing import Optional
from fastapi import APIRouter, Query, Path, Depends
from app.controllers.task_controller import task_controller
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.middleware.auth import verify_appid_token

router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
    dependencies=[Depends(verify_appid_token)]
)

@router.get("", summary="Get all tasks or filter by search/status")
def get_tasks(
    search: Optional[str] = Query(None, description="Search tasks by title or keyword"),
    status: Optional[str] = Query(None, description="Filter tasks by status: Pending, In Progress, Completed"),
):
    """Retrieve all task documents from Cloudant database with search & filter support."""
    return task_controller.get_all_tasks(search=search, status=status)

@router.get("/{id}", summary="Get task by ID")
def get_task_by_id(
    id: str = Path(..., description="Unique task identifier")
):
    """Get single task document details by ID."""
    return task_controller.get_task_by_id(id)

@router.post("", summary="Create a new task", status_code=201)
def create_task(task_data: TaskCreate):
    """Create a new task document in IBM Cloudant."""
    return task_controller.create_task(task_data)

@router.put("/{id}", summary="Update an existing task")
def update_task(
    task_data: TaskUpdate,
    id: str = Path(..., description="Unique task identifier")
):
    """Update fields of an existing task document."""
    return task_controller.update_task(id, task_data)

@router.delete("/{id}", summary="Delete task by ID")
def delete_task(
    id: str = Path(..., description="Unique task identifier")
):
    """Delete a task document from IBM Cloudant database."""
    return task_controller.delete_task(id)
