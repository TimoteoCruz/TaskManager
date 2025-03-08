import api from "./api";

export const createGroup = async (groupName, users) => {
    try {
        const response = await api.post("/group", { groupName, users });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addUserToGroup = async (groupId, email) => {
    try {
        const response = await api.post(`/groups/${groupId}/add-user`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateGroupCreator = async (groupId, creatorId) => {
    try {
        const response = await api.patch(`/groups/${groupId}`, { creatorId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getGroups = async () => {
    try {
        const response = await api.get("/groups");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createTask = async (groupId, taskData) => {
    try {
        const response = await api.post(`/group/${groupId}/task`, taskData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
