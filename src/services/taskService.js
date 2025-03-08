import api from "./api";

export const createTask = async (groupId, taskData) => {
    try {
        const response = await api.post(`/group/${groupId}/task`, taskData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createGeneralTask = async (taskData) => {
    try {
        const response = await api.post("/task", taskData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getTasks = async () => {
    try {
        const response = await api.get("/tasks");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await api.delete(`/task/${taskId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateTaskStatus = async (taskId, status) => {
    try {
        const response = await api.put(`/task/${taskId}`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};