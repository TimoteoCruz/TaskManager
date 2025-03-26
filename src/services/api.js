import axios from "axios";
const API_BASE_URL="http://localhost:3000/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "content-Type": "application/json",
    },

    withCredentials: false,
});

api.interceptors.request.use(
    async (config) =>{
        console.log('Entering interceptor configuration')
        const token = await localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        
        }console.debug("returning interceptor configuration");
        return config;
    },
    (error) =>{
        console.log('Error in Interceptor Configuration', error);
        Promise.reject(error);
    }
)

export default api;
