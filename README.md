# Cloudant Task Manager

A full-stack task manager built with React and FastAPI. Tasks are stored in IBM Cloudant when credentials are configured; otherwise the API uses an in-memory fallback for local development. Authentication supports IBM App ID and a local developer bypass mode.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Python, FastAPI, Pydantic, Uvicorn
- Services: IBM Cloudant NoSQL and IBM App ID

## Features

- Create, view, edit, delete, search, filter, and sort tasks
- Task status and priority controls with due dates
- IBM App ID authorization-code sign-in
- Developer Bypass Mode for local work
- Cloudant persistence with an in-memory fallback when Cloudant is unavailable
- REST API documentation at `/docs`

## Project structure

```text
.
├── frontend/       # React single-page application
└── backend/        # FastAPI REST API and Cloudant integration
```

## Run locally

### 1. Configure environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

For Cloudant persistence and IBM App ID sign-in, fill in the corresponding values in `backend/.env`. Set the public App ID client values in `frontend/.env` to the matching client and server URL. If those values are left empty, select **Developer Bypass Mode** in the app.

### 2. Start the API

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

The API runs at `http://localhost:8000`; Swagger UI is available at `http://localhost:8000/docs`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

All task endpoints require `Authorization: Bearer <token>`. In local Developer Bypass Mode, the application uses its development token automatically.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/tasks` | List tasks; accepts `search` and `status` query parameters |
| `GET` | `/api/tasks/{id}` | Get a task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/{id}` | Update a task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |
| `POST` | `/api/auth/token` | Exchange an IBM App ID authorization code |

## Verification

```bash
cd frontend && npm run build
cd ../backend && pytest -q
```

## Security notes

- Do not commit `.env` files or API keys; use the supplied `.env.example` templates.
- Register your local and deployed frontend URLs as valid redirect URLs in IBM App ID.
- Set `DEBUG=False` in production and use a restricted `ALLOWED_ORIGINS` list.
