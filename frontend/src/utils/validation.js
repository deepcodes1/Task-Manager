import { TASK_STATUSES, TASK_PRIORITIES } from './constants';

export const taskValidationRules = {
  title: {
    required: 'Task title is required',
    minLength: {
      value: 3,
      message: 'Title must be at least 3 characters',
    },
    maxLength: {
      value: 100,
      message: 'Title cannot exceed 100 characters',
    },
  },
  description: {
    maxLength: {
      value: 500,
      message: 'Description cannot exceed 500 characters',
    },
  },
  status: {
    required: 'Task status is required',
    validate: (value) =>
      TASK_STATUSES.includes(value) || 'Please select a valid task status',
  },
  priority: {
    required: 'Task priority is required',
    validate: (value) =>
      TASK_PRIORITIES.includes(value) || 'Please select a valid task priority',
  },
  dueDate: {
    required: 'Due date is required',
  },
};
