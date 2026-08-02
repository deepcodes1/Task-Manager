from app.repositories.task_repository import TaskRepository
from app.models.task_model import TaskModel

def test_repository_storage():
    repo = TaskRepository()

    doc = {
        "id": "db_test_001",
        "title": "Database Test",
        "description": "Testing repository store",
        "status": "Pending",
        "created_at": "2026-07-27T00:00:00Z",
        "updated_at": "2026-07-27T00:00:00Z",
    }

    # Test create
    saved = repo.create_task(doc)
    assert saved["id"] == "db_test_001"

    # Test TaskModel validation
    model_instance = TaskModel(**saved)
    assert model_instance.title == "Database Test"

    # Test retrieval
    retrieved = repo.get_task_by_id("db_test_001")
    assert retrieved is not None
    assert retrieved["title"] == "Database Test"

    # Test deletion
    deleted = repo.delete_task("db_test_001")
    assert deleted is True
