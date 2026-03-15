import axios, { Method } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient = async <T>(
    endpoint: string,
    method: Method,
    data: any
): Promise<T> => {
    console.log(`API Request: ${method} ${endpoint}`, data || {});
    try {
        const res = await axios({
            url: `${API_URL}/api${endpoint}`,
            method,
            data,
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": "sagar189",
            },
        });

        return res.data;
    } catch (error: any) {

        if (error.response?.data) {

            throw error.response.data;
        }
        throw new Error(error.response?.data || error.message || "API Error");
    }
};