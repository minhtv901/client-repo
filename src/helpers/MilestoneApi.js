// src/helpers/MilestoneApi.js
import axiosInstance from './axiosInstance';

export const checkAndSaveMilestone = async (data) => {
    try {
        const res = await axiosInstance.post('/milestones', data);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getMilestones = async () => {
    try {
        const res = await axiosInstance.get('/milestones');
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
