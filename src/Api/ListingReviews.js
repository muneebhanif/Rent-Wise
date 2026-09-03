
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/auth/reviews`;


// Listing Review Routes

export const AddReviews = (id) =>
    axios.post(`${API_BASE_URL}/listing/:id`, data, { withCredentials: true });