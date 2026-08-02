import { TASK_STATUS, TASK_PRIORITY } from './constants';

/**
 * Standardize task identifier to handle Cloudant NoSQL _id vs standard id
 */
export const getTaskId = (task) => {
  if (!task) return null;
  return task.id || task._id || task._rev || null;
};

/**
 * Format ISO date string into readable date format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format ISO date string into date input field format YYYY-MM-DD
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

/**
 * Check if a date string is past today (Overdue)
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === TASK_STATUS.COMPLETED) return false;
  try {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  } catch {
    return false;
  }
};

/**
 * Get CSS badge style classes for Task Status
 */
export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case TASK_STATUS.COMPLETED:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case TASK_STATUS.IN_PROGRESS:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case TASK_STATUS.PENDING:
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

/**
 * Get CSS badge style classes for Task Priority
 */
export const getPriorityBadgeStyle = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case TASK_PRIORITY.MEDIUM:
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case TASK_PRIORITY.LOW:
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

/**
 * Truncate long text strings cleanly
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
