import axiosInstance from "@/lib/axios";

export const generateTrip = (tripData) => {
    return axiosInstance.post("/trips/generate", tripData);
}

export const getTrips = () => {
    return axiosInstance.get("/trips");
}

export const getTrip = (tripId) => {
    return axiosInstance.get(`/trips/${tripId}`);
}

export const getDashboardStats = () => {
    return axiosInstance.get("/trips/dashboard-stats");
}

export const addActivity = (tripId, data) => {
    return axiosInstance.patch(`/trips/${tripId}/add-activity`, data);
}

export const removeActivity = (tripId, data) => {
    return axiosInstance.patch(`/trips/${tripId}/remove-activity`, data);
}

export const regenerateDay = (tripId, data) => {
    return axiosInstance.patch(`/trips/${tripId}/regenerate-day`, data);
}

export const deleteTrip = (tripId) => {
    return axiosInstance.delete(`/trips/${tripId}`);
}