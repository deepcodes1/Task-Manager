import axios from 'axios';

// Create base Axios instance configured with environment variables
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://afefd685-32b9-4830-b5b1-42279e6ceadd-bluemix.cloudantnosqldb.appdomain.cloud/task_manager',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('appid_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Custom global error handling & formatting
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

export default API;
