// src/helpers/JournalApi.js
import axiosInstance from './axiosInstance';

export const createJournal = async (data) => {
    try {
        const res = await axiosInstance.post('/journal', data);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getJournals = async () => {
    try {
        const res = await axiosInstance.get('/journal');
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getJournalById = async (id) => {
    try {
        const res = await axiosInstance.get(`/journal/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateJournal = async (id, data) => {
    try {
        const res = await axiosInstance.put(`/journal/${id}`, data);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteJournal = async (id) => {
    try {
        const res = await axiosInstance.delete(`/journal/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
