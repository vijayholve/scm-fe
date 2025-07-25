import axios from 'axios';

// Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL, // Default baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem('SCM-AUTH'));
    const token = authData?.accessToken || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized, logging out...');
    }
    return Promise.reject(error);
  }
);

// API request functions

const get = (url, params = {}, config = {}) => {
  return apiClient.get(url, { params, ...config });
};

const post = (url, data = {}, config = {}) => {
  return apiClient.post(url, data, { ...config });
};

const put = (url, data = {}, config = {}) => {
  return apiClient.put(url, data, { ...config });
};

const del = (url, config = {}) => {
  return apiClient.delete(url, { ...config });
};

// Export the API functions
export default {
  get,
  post,
  put,
  delete: del,
};

// Example usage:
// import api from './apiService';
// api.get('/users').then(response => console.log(response)).catch(err => console.error(err));

const userDetails = {
  getUser: () => {
    const authData = JSON.parse(localStorage.getItem('SCM-AUTH'));
    return authData?.data || null;
  },
  getAccountId: () => {
    const authData = JSON.parse(localStorage.getItem('SCM-AUTH'));
    return authData?.data?.accountId || null;
  },
  getPermissions: () => {
    const authData = JSON.parse(localStorage.getItem('SCM-AUTH'));
    return authData?.data?.role?.permissions || [];
  }

};
export { userDetails };

