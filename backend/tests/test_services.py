from app.services.task_service import TaskService
from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import TaskCreate, TaskUpdate

def test_service_crud_workflow():
    repo = TaskRepository()
    service = TaskService(repository=repo)

    # 1. Create task
    task_input = TaskCreate(
        title="Service Unit Test Task",
        description="Testing service business logic",
        status="Pending",
        priority="High",
        dueDate="2026-08-15",
    )
    created = service.create_task(task_input)
    assert created["title"] == "Service Unit Test Task"
    assert created["priority"] == "High"
    assert created["dueDate"] == "2026-08-15"
    task_id = created["id"]

    # 2. Get task by ID
    found = service.get_task_by_id(task_id)
    assert found is not None
    assert found["id"] == task_id

    # 3. Search and filter
    results = service.get_all_tasks(search="Unit Test", status="Pending")
    assert len(results) >= 1
    assert results[0]["id"] == task_id

    # 4. Update task
    updated = service.update_task(task_id, TaskUpdate(status="In Progress", priority="Low", dueDate="2026-08-20"))
    assert updated["status"] == "In Progress"
    assert updated["priority"] == "Low"
    assert updated["dueDate"] == "2026-08-20"

    # 5. Delete task
    deleted = service.delete_task(task_id)
    assert deleted is True
    assert service.get_task_by_id(task_id) is None
