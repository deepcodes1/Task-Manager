from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

ALLOWED_TASK_STATUSES = [status.value for status in TaskStatus]

class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

ALLOWED_TASK_PRIORITIES = [priority.value for priority in TaskPriority]

# Standard API Messages
MSG_TASK_CREATED = "Task created successfully"
MSG_TASK_UPDATED = "Task updated successfully"
MSG_TASK_DELETED = "Task deleted successfully"
MSG_TASK_FETCHED = "Task retrieved successfully"
MSG_TASKS_FETCHED = "Tasks retrieved successfully"
MSG_TASK_NOT_FOUND = "Task not found"
MSG_VALIDATION_ERROR = "Validation error"
MSG_INTERNAL_ERROR = "An internal server error occurred"
