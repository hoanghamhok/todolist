import axios from "axios";

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000"
    : import.meta.env.VITE_API_URL;

//create axios instance
const api = axios.create({
    baseURL : API_BASE,
    headers:{
        'Content-Type':'application/json',
    }
})

// Request interceptor - tự động thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn -> logout
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
