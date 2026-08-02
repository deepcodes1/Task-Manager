// API endpoints map matching backend REST routes
export const ENDPOINTS = {
  TASKS: 'https://afefd685-32b9-4830-b5b1-42279e6ceadd-bluemix.cloudantnosqldb.appdomain.cloud/task_manager',
  TASK_BY_ID: (id) => `/tasks/${id}`,
};
