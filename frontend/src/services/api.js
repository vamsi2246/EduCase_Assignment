import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: 'An unexpected connection issue occurred. Please check your server status.',
      status: 500,
      details: null
    };

    if (error.response) {
      customError.message = error.response.data?.error?.message || error.response.data?.message || 'Server error occurred.';
      customError.status = error.response.status;
      customError.details = error.response.data?.error?.details || null;
    } else if (error.request) {
      customError.message = 'No response received from the API server. Ensure backend server is booted and running.';
      customError.status = 503;
    }

    return Promise.reject(customError);
  }
);

export default api;
