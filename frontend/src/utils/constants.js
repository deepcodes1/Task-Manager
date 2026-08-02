// Task Status Constants
export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const TASK_STATUSES = [
  TASK_STATUS.PENDING,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.COMPLETED,
];

// Task Priority Constants
export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const TASK_PRIORITIES = [
  TASK_PRIORITY.LOW,
  TASK_PRIORITY.MEDIUM,
  TASK_PRIORITY.HIGH,
];

// Toast notification settings
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

// Sort Options
export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt_desc' },
  { label: 'Oldest First', value: 'createdAt_asc' },
  { label: 'Due Date (Soonest)', value: 'dueDate_asc' },
  { label: 'Priority (High to Low)', value: 'priority_desc' },
  { label: 'Title (A-Z)', value: 'title_asc' },
];
