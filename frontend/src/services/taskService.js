import API from './axiosConfig';
import { ENDPOINTS } from './api';
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants';

// Initial fallback mock data for Cloudant NoSQL tasks when offline/testing
const MOCK_TASKS = [
  {
    _id: 'task_001',
    id: 'task_001',
    _rev: '1-a1b2c3d4e5f6',
    title: 'Deploy Backend to IBM Cloudant',
    description: 'Set up Cloudant NoSQL database instance, configure IAM API keys, and test Express REST API endpoints.',
    status: TASK_STATUS.IN_PROGRESS,
    priority: TASK_PRIORITY.HIGH,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'task_002',
    id: 'task_002',
    _rev: '1-f6e5d4c3b2a1',
    title: 'Implement React Hook Form Validation',
    description: 'Create task form components with title, description, status, priority, and due date validation schemas.',
    status: TASK_STATUS.COMPLETED,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'task_003',
    id: 'task_003',
    _rev: '1-9876543210ab',
    title: 'Design Dark-Mode Glassmorphism UI',
    description: 'Style the frontend application using Tailwind CSS with glassmorphism cards, glowing badges, and subtle hover animations.',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.HIGH,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'task_004',
    id: 'task_004',
    _rev: '1-0123456789cd',
    title: 'Add Toast Notifications & Modals',
    description: 'Integrate React Toastify for real-time CRUD feedback and ConfirmModal for safe deletion handling.',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.LOW,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getLocalMockState = () => {
  const saved = localStorage.getItem('appid_local_tasks');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [...MOCK_TASKS];
    }
  }
  return [...MOCK_TASKS];
};

let localMockState = getLocalMockState();

const saveLocalMockState = (tasks) => {
  localMockState = tasks;
  localStorage.setItem('appid_local_tasks', JSON.stringify(tasks));
};

export const taskService = {
  /**
   * Fetch all tasks (GET /tasks)
   */
  getAllTasks: async () => {
    try {
      const response = await API.get(ENDPOINTS.TASKS);
      const resData = response.data;
      const tasks = Array.isArray(resData)
        ? resData
        : resData.data || resData.docs || resData.tasks || [];
      return tasks;
    } catch (error) {
      console.warn('Backend API connection failed, returning fallback state:', error.message);
      return localMockState;
    }
  },

  /**
   * Fetch single task by ID (GET /tasks/:id)
   */
  getTaskById: async (id) => {
    try {
      const response = await API.get(ENDPOINTS.TASK_BY_ID(id));
      const resData = response.data;
      return resData.data !== undefined ? resData.data : (resData.task || resData.doc || resData);
    } catch (error) {
      console.warn(`Backend API connection failed for ID ${id}, searching local fallback:`, error.message);
      const found = localMockState.find((t) => (t.id === id || t._id === id));
      if (!found) throw new Error(`Task with ID ${id} not found.`);
      return found;
    }
  },

  /**
   * Create a new task (POST /tasks)
   */
  createTask: async (taskData) => {
    try {
      const response = await API.post(ENDPOINTS.TASKS, taskData);
      const resData = response.data;
      return resData.data !== undefined ? resData.data : (resData.task || resData.doc || resData);
    } catch (error) {
      console.warn('Backend API failed, simulating task creation locally:', error.message);
      const newId = `task_${Date.now()}`;
      const newTask = {
        _id: newId,
        id: newId,
        _rev: `1-${Math.random().toString(36).substring(2, 10)}`,
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveLocalMockState([newTask, ...localMockState]);
      return newTask;
    }
  },

  /**
   * Update existing task (PUT /tasks/:id)
   */
  updateTask: async (id, updatedData) => {
    try {
      const response = await API.put(ENDPOINTS.TASK_BY_ID(id), updatedData);
      const resData = response.data;
      return resData.data !== undefined ? resData.data : (resData.task || resData.doc || resData);

    } catch (error) {
      console.warn(`Backend API failed, updating task ${id} locally:`, error.message);
      let updatedTask = null;
      const newTasks = localMockState.map((task) => {
        if (task.id === id || task._id === id) {
          updatedTask = {
            ...task,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          };
          return updatedTask;
        }
        return task;
      });

      if (!updatedTask) throw new Error(`Task with ID ${id} not found.`);
      saveLocalMockState(newTasks);
      return updatedTask;
    }
  },

  /**
   * Delete task by ID (DELETE /tasks/:id)
   */
  deleteTask: async (id) => {
    try {
      const response = await API.delete(ENDPOINTS.TASK_BY_ID(id));
      return response.data;
    } catch (error) {
      console.warn(`Backend API failed, deleting task ${id} locally:`, error.message);
      saveLocalMockState(localMockState.filter((t) => t.id !== id && t._id !== id));
      return { success: true, id };
    }
  },
};

export default taskService;
