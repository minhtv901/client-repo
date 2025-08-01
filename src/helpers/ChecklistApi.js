// src/helpers/ChecklistApi.js
import axiosInstance from './axiosInstance';

export const createChecklist = async (data) => {
    try {
        const res = await axiosInstance.post('/checklist', data);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getChecklists = async () => {
    try {
        const res = await axiosInstance.get('/checklist');
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getChecklistById = async (id) => {
    try {
        const res = await axiosInstance.get(`/checklist/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateChecklist = async (id, data) => {
    try {
        const res = await axiosInstance.put(`/checklist/${id}`, data);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteChecklist = async (id) => {
    try {
        const res = await axiosInstance.delete(`/checklist/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
