// src/helpers/axiosInstance.js
import axios from 'axios';

const backendUrl = 'http://localhost:4000';

// Tạo một instance riêng của axios
const axiosInstance = axios.create({
    baseURL: backendUrl,
});

// Thêm interceptor để tự động gắn token vào header Authorization trước mỗi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Gắn vào header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
