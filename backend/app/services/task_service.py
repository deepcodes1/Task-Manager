from typing import List, Optional, Dict, Any
from app.repositories.task_repository import task_repository, TaskRepository
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.utils.helpers import generate_uuid, get_utc_timestamp, clean_dict
from app.utils.logger import logger

class TaskService:
    """Service Layer handling Business Logic and Domain Rules for Tasks."""

    def __init__(self, repository: TaskRepository = task_repository):
        self.repository = repository

    def get_all_tasks(
        self,
        search: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch tasks with optional title search and status filtering.
        """
        tasks = self.repository.get_all_tasks()

        # Apply Title Search Filter if provided
        if search and search.strip():
            query = search.strip().lower()
            tasks = [
                t for t in tasks
                if query in t.get("title", "").lower() or query in t.get("description", "").lower()
            ]

        # Apply Status Filter if provided
        if status and status.strip():
            target_status = status.strip().lower()
            tasks = [
                t for t in tasks
                if t.get("status", "").lower() == target_status
            ]

        # Sort by creation date (newest first)
        tasks.sort(
            key=lambda t: t.get("created_at") or "",
            reverse=True
        )

        return tasks

    def get_task_by_id(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get single task by ID."""
        return self.repository.get_task_by_id(task_id)

    def create_task(self, task_data: TaskCreate) -> Dict[str, Any]:
        """Process and create a new task."""
        now = get_utc_timestamp()
        new_id = generate_uuid()

        document = {
            "id": new_id,
            "title": task_data.title,
            "description": task_data.description,
            "status": task_data.status,
            "priority": task_data.priority,
            "dueDate": task_data.dueDate.isoformat(),
            "created_at": now,
            "updated_at": now,
        }

        created_doc = self.repository.create_task(document)
        logger.info(f"TaskService: Created task {new_id}")
        return created_doc

    def update_task(self, task_id: str, task_data: TaskUpdate) -> Optional[Dict[str, Any]]:
        """Update existing task fields."""
        # JSON mode serializes dates before the update is sent to Cloudant.
        update_dict = clean_dict(task_data.model_dump(exclude_unset=True, mode="json"))
        if not update_dict:
            return self.get_task_by_id(task_id)

        update_dict["updated_at"] = get_utc_timestamp()
        updated_doc = self.repository.update_task(task_id, update_dict)
        
        if updated_doc:
            logger.info(f"TaskService: Updated task {task_id}")
        return updated_doc

    def delete_task(self, task_id: str) -> bool:
        """Delete task by ID."""
        success = self.repository.delete_task(task_id)
        if success:
            logger.info(f"TaskService: Deleted task {task_id}")
        return success

task_service = TaskService()
