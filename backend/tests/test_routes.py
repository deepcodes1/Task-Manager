from fastapi.testclient import TestClient
from app.main import app
from app.middleware.auth import verify_appid_token

# Override the auth dependency for testing so we don't need real App ID tokens
app.dependency_overrides[verify_appid_token] = lambda: {"sub": "test_user_id", "name": "Test User", "email": "test@example.com"}

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "data" in json_data

def test_create_task_success():
    payload = {
        "title": "Build FastAPI Backend",
        "description": "Create REST APIs with IBM Cloudant integration",
        "status": "Pending",
        "priority": "High",
        "dueDate": "2026-08-15",
    }
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 201
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["title"] == payload["title"]
    assert json_data["data"]["status"] == payload["status"]
    assert json_data["data"]["priority"] == payload["priority"]
    assert json_data["data"]["dueDate"] == payload["dueDate"]
    assert "id" in json_data["data"]

def test_create_task_validation_error():
    payload = {
        "title": "",  # Empty title invalid
        "description": "Invalid description",
        "status": "InvalidStatus",
        "priority": "Urgent",
        "dueDate": "not-a-date",
    }
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 422
    json_data = response.json()
    assert json_data["success"] is False

def test_get_all_tasks():
    response = client.get("/api/tasks")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert isinstance(json_data["data"], list)

def test_get_task_by_id_and_update_and_delete():
    # 1. Create a task
    create_payload = {
        "title": "Task To Edit",
        "description": "Testing CRUD flow",
        "status": "In Progress",
        "priority": "Medium",
        "dueDate": "2026-08-15",
    }
    created = client.post("/api/tasks", json=create_payload).json()["data"]
    task_id = created["id"]

    # 2. Get task by ID
    get_res = client.get(f"/api/tasks/{task_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == task_id

    # 3. Update task
    update_payload = {"status": "Completed", "priority": "Low", "dueDate": "2026-08-20"}
    put_res = client.put(f"/api/tasks/{task_id}", json=update_payload)
    assert put_res.status_code == 200
    assert put_res.json()["data"]["status"] == "Completed"
    assert put_res.json()["data"]["priority"] == "Low"
    assert put_res.json()["data"]["dueDate"] == "2026-08-20"

    # 4. Delete task
    del_res = client.delete(f"/api/tasks/{task_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 5. Confirm deletion returns 404
    get_again = client.get(f"/api/tasks/{task_id}")
    assert get_again.status_code == 404
