# Cloud-Powered Task Manager REST API Backend

Production-Ready **Python FastAPI** REST API backend for the Cloud-Powered Task Manager web application, backed by **IBM Cloudant NoSQL Database**.

---

## 🌟 Tech Stack

- **Python 3.11+**
- **FastAPI**: High-performance web framework for building APIs.
- **Uvicorn**: Lightning-fast ASGI server implementation.
- **IBM Cloudant NoSQL Database**: Cloud-hosted document database.
- **ibmcloudant SDK**: Official IBM Cloudant Python SDK.
- **Pydantic**: Data validation and schema enforcement.
- **python-dotenv**: Environment configuration manager.
- **Pytest & HTTPX**: Automated testing framework.

---

## 📁 Architecture

Follows Clean **MVC & Repository Pattern**:

```
backend/
├── app/
│   ├── main.py                  # FastAPI app factory & routes registration
│   ├── config/
│   │   ├── settings.py          # Environment settings loader
│   │   └── cloudant.py          # IBM Cloudant SDK connection manager
│   ├── routes/
│   │   └── task_routes.py       # REST API endpoints (/api/tasks)
│   ├── controllers/
│   │   └── task_controller.py   # HTTP request/response controller
│   ├── services/
│   │   └── task_service.py      # Business logic & filter/search engine
│   ├── repositories/
│   │   └── task_repository.py   # IBM Cloudant NoSQL CRUD operations
│   ├── schemas/
│   │   └── task_schema.py       # Pydantic validation schemas
│   ├── models/
│   │   └── task_model.py        # Task document model
│   ├── middleware/
│   │   ├── cors.py              # CORS setup for React frontend
│   │   ├── logging_middleware.py # Request execution logger
│   │   └── exception_handler.py # Global JSON error formatter
│   └── utils/
│       ├── constants.py         # Task statuses & standard messages
│       ├── helpers.py           # UUID & timestamp generators
│       ├── logger.py            # Logger utility
│       └── responses.py         # Standardized JSON response helpers
├── tests/                       # Pytest unit & integration test suite
├── .env.example                 # Example environment variables
├── requirements.txt             # Python package dependencies
├── run.py                       # Server launcher script
└── README.md
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your IBM Cloudant credentials:

```bash
APP_NAME=Task Manager API
HOST=0.0.0.0
PORT=8000
DEBUG=True

# IBM Cloudant Credentials
CLOUDANT_URL=https://your-cloudant-instance.cloudantnosqldb.appdomain.cloud
CLOUDANT_API_KEY=your_ibm_cloud_iam_api_key
CLOUDANT_DATABASE=task_manager

# CORS Frontend Origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🚀 Installation & Setup

### 1. Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Server

```bash
# Using run.py launcher
python run.py

# Or directly with Uvicorn:
uvicorn app.main:app --reload --port 8000
```

---

## 📖 API Documentation & Endpoints

Server Base URL: **`http://localhost:8000`**

Interactive Swagger Documentation: **`http://localhost:8000/docs`**  
ReDoc Documentation: **`http://localhost:8000/redoc`**

### REST API Reference (`/api/tasks`)

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks (supports search & filter) | `?search=title` & `?status=Pending` |
| `GET` | `/api/tasks/{id}` | Get single task details | `id`: string (UUID) |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "...", "description": "...", "status": "Pending" }` |
| `PUT` | `/api/tasks/{id}` | Update existing task | `{ "title": "...", "status": "Completed" }` |
| `DELETE` | `/api/tasks/{id}` | Delete task document | None |

### Standard Response Format

**Success Response (HTTP 200/201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "e4a3b2c1-0000-4444-8888-123456789abc",
    "title": "Learn FastAPI",
    "description": "Complete backend with IBM Cloudant",
    "status": "Pending",
    "created_at": "2026-07-27T10:00:00+00:00",
    "updated_at": "2026-07-27T10:00:00+00:00"
  }
}
```

---

## 🧪 Running Tests

Run the full automated Pytest test suite:

```bash
pytest -v
```
