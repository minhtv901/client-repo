// src/helpers/axiosInstance.js
import axios from 'axios';

const backendUrl = 'https://mindclean.onrender.com';

const axiosInstance = axios.create({
    baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
