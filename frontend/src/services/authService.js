import axiosInstance from "@/lib/axios"

export const registerUser = (userData) => {
    return axiosInstance.post("/auth/register", userData);
}

export const loginUser = (credentials) => {
    return axiosInstance.post("/auth/login", credentials);
}