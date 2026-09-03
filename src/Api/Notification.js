import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/notification`

export const getNotifications = () => {
  return axios.get(`${API_BASE_URL}/get-notifications`, { withCredentials: true });
};

export const readAllNotifications = () => {
  return axios.patch(`${API_BASE_URL}/read-all-notifications`, null,  { withCredentials: true });
};

export const clearAllNotifications = () => {
  return axios.delete(`${API_BASE_URL}/clear-all-notifications`,{ withCredentials: true });
};

export const readOneNotification = (notificationId) => {
  return axios.patch(`${API_BASE_URL}/read-notification/${notificationId}`, null, { withCredentials: true });
};