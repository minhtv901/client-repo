// src/helpers/StreakApi.js
import axiosInstance from './axiosInstance';

export const getStreak = async () => {
    try {
        const res = await axiosInstance.get('/streak');
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const increaseStreak = async () => {
    try {
        const res = await axiosInstance.post('/streak/increase');
        let status = "success";
        if (
            res.data?.message &&
            res.data.message.toLowerCase().includes("already")
        ) {
            status = "already";
        }
        return { status, data: res.data };
    } catch (error) {
        console.error(error);
        return { status: "error", data: null };
    }
};

export const getStreakById = async (id) => {
    try {
        const res = await axiosInstance.get(`/streak/viewstreakbyid/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const relapseStreak = async () => {
    try {
        const res = await axiosInstance.post('/streak/relapse');
        return res.data;
    } catch (error) {
        // Hiện lỗi chi tiết hơn
        if (error.response) {
            console.error(error.response.data);
            throw new Error(error.response.data.error || "Unexpected error occurred");
        }
        console.error(error);
        throw new Error("Could not reset streak. Please try again later.");
    }
};
