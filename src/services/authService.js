import api from "./api";

export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const register = async (email, username, password) => {
    try {
        const response = await api.post("/register", { email, username, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
