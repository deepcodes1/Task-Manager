from typing import Optional
from fastapi.responses import JSONResponse
from app.services.task_service import task_service, TaskService
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.utils.responses import success_response, error_response
from app.utils.constants import (
    MSG_TASK_CREATED,
    MSG_TASK_UPDATED,
    MSG_TASK_DELETED,
    MSG_TASK_FETCHED,
    MSG_TASKS_FETCHED,
    MSG_TASK_NOT_FOUND,
)

class TaskController:
    """Controller Layer converting service results into standardized HTTP responses."""

    def __init__(self, service: TaskService = task_service):
        self.service = service

    def get_all_tasks(
        self,
        search: Optional[str] = None,
        status: Optional[str] = None
    ) -> JSONResponse:
        tasks = self.service.get_all_tasks(search=search, status=status)
        return success_response(
            message=MSG_TASKS_FETCHED,
            data=tasks,
            status_code=200
        )

    def get_task_by_id(self, task_id: str) -> JSONResponse:
        task = self.service.get_task_by_id(task_id)
        if not task:
            return error_response(
                message=MSG_TASK_NOT_FOUND,
                status_code=404
            )
        return success_response(
            message=MSG_TASK_FETCHED,
            data=task,
            status_code=200
        )

    def create_task(self, task_data: TaskCreate) -> JSONResponse:
        created_task = self.service.create_task(task_data)
        return success_response(
            message=MSG_TASK_CREATED,
            data=created_task,
            status_code=201
        )

    def update_task(self, task_id: str, task_data: TaskUpdate) -> JSONResponse:
        existing = self.service.get_task_by_id(task_id)
        if not existing:
            return error_response(
                message=MSG_TASK_NOT_FOUND,
                status_code=404
            )

        updated_task = self.service.update_task(task_id, task_data)
        return success_response(
            message=MSG_TASK_UPDATED,
            data=updated_task,
            status_code=200
        )

    def delete_task(self, task_id: str) -> JSONResponse:
        success = self.service.delete_task(task_id)
        if not success:
            return error_response(
                message=MSG_TASK_NOT_FOUND,
                status_code=404
            )
        return success_response(
            message=MSG_TASK_DELETED,
            data={"id": task_id},
            status_code=200
        )

task_controller = TaskController()
