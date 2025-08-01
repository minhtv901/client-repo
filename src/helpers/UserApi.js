// src/helpers/UserApi.js
import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
    try {
        const res = await axiosInstance.post('/user/register', userData);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const loginUser = async (userData) => {
    try {
        const res = await axiosInstance.post('/user/login', userData);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token); // Lưu token
        }
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const startChallenge = async (userId) => {
    try {
        const res = await axiosInstance.post('/user/challengestart', { userId });
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getProfile = async () => { 
    try {
        const res = await axiosInstance.get('/user/profile');
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};