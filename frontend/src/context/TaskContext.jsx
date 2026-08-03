import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import taskService from '../services/taskService';
import { getTaskId } from '../utils/helpers';
import { TOAST_CONFIG } from '../utils/constants';
import { useAuth } from './AuthContext';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  /**
   * Fetch all tasks from API
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data || []);
    } catch (err) {
      const msg = err.message || 'Failed to load tasks.';
      setError(msg);
      toast.error(msg, TOAST_CONFIG);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single task by ID
   */
  const fetchTaskById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const task = await taskService.getTaskById(id);
      setSelectedTask(task);
      return task;
    } catch (err) {
      const msg = err.message || `Failed to fetch task with ID: ${id}`;
      setError(msg);
      toast.error(msg, TOAST_CONFIG);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new task
   */
  const addTask = async (taskData) => {
    setLoading(true);
    try {
      const created = await taskService.createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      toast.success('Task created successfully! 🎉', TOAST_CONFIG);
      return created;
    } catch (err) {
      const msg = err.message || 'Failed to create task.';
      toast.error(msg, TOAST_CONFIG);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing task
   */
  const editTask = async (id, updatedData) => {
    setLoading(true);
    try {
      const updated = await taskService.updateTask(id, updatedData);
      setTasks((prev) =>
        prev.map((t) => (getTaskId(t) === id ? updated : t))
      );
      if (selectedTask && getTaskId(selectedTask) === id) {
        setSelectedTask(updated);
      }
      toast.success('Task updated successfully! ✨', TOAST_CONFIG);
      return updated;
    } catch (err) {
      const msg = err.message || 'Failed to update task.';
      toast.error(msg, TOAST_CONFIG);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a task by ID
   */
  const removeTask = async (id) => {
    setLoading(true);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => getTaskId(t) !== id));
      if (selectedTask && getTaskId(selectedTask) === id) {
        setSelectedTask(null);
      }
      toast.success('Task deleted successfully! 🗑️', TOAST_CONFIG);
    } catch (err) {
      const msg = err.message || 'Failed to delete task.';
      toast.error(msg, TOAST_CONFIG);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch only after authentication has completed. This avoids firing protected
  // requests while the session is still being restored.
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setTasks([]);
      setSelectedTask(null);
      setLoading(false);
      return;
    }

    fetchTasks();
  }, [authLoading, isAuthenticated, fetchTasks]);

  // Compute filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query filter (title or description match)
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          (task.title && task.title.toLowerCase().includes(query)) ||
          (task.description && task.description.toLowerCase().includes(query));

        // Status filter
        const matchesStatus =
          statusFilter === 'ALL' || task.status === statusFilter;

        // Priority filter
        const matchesPriority =
          priorityFilter === 'ALL' || task.priority === priorityFilter;

        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'createdAt_desc') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'createdAt_asc') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'dueDate_asc') {
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        }
        if (sortBy === 'title_asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'priority_desc') {
          const pMap = { High: 3, Medium: 2, Low: 1 };
          return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  // Compute Task Counters
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
      highPriority: tasks.filter((t) => t.priority === 'High').length,
    };
  }, [tasks]);

  const value = {
    tasks,
    filteredTasks,
    stats,
    selectedTask,
    loading,
    error,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortBy,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    fetchTasks,
    fetchTaskById,
    addTask,
    editTask,
    removeTask,
    setSelectedTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
