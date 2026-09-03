import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/review`



export const createListingReview = (id, data) => 
    axios.post(`${API_BASE_URL}/Createlisting/${id}`, data, { withCredentials: true });

export const getListingReviews = (id) => 
    axios.get(`${API_BASE_URL}/listing/${id}`, { withCredentials: true });

export const createUserReview = (id, data) => 
    axios.post(`${API_BASE_URL}/CreateUser/${id}`, data, { withCredentials: true });

export const getUserReviews = (id) => 
    axios.get(`${API_BASE_URL}/User/${id}`, { withCredentials: true });