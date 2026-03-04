import axios from "axios";

const API_URL = import.meta.env.VITE_NODE_ENV === "production" ? import.meta.env.VITE_API_URL : "http://localhost:3000";


console.log(API_URL);

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true, // Para enviar las cookies de la sesion al servidor
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt");

        //console.log("Token Interceptors: Bearer", token)
        
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
