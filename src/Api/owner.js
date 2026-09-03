import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/owner`


export const getOwnerProfileData = (id) =>
    axios.get(`${API_BASE_URL}/profile/${id}`, { withCredentials: true });
