import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/renter`


export const fetchAllRenterAggreements = () =>
    axios.get(`${API_BASE_URL}/aggreements`, { withCredentials: true });
