import axios from 'axios';
import { getAuthConfig } from './api';
const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/conversations`;
export const createMessage = (data) => axios.post(`${API_BASE_URL}/CreateMessages`, data, getAuthConfig());
export const fetchConversationsForSidebar = (signal) => axios.get(`${API_BASE_URL}/GetAllConversations`, { ...getAuthConfig(), signal });
export const fetchMessagesByConversation = (id, signal) => axios.get(`${API_BASE_URL}/FetchAllMessages/${id}/messages`, { ...getAuthConfig(), signal });
export const getSideBarParticipants = () => axios.get(`${API_BASE_URL}/sidebar`, getAuthConfig());
