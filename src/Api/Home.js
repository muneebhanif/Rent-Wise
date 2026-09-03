import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/Specificlistings`


export const getAllCar = () =>
    axios.get(`${API_BASE_URL}/car`, { withCredentials: true });


export const getAllHouse = () =>
    axios.get(`${API_BASE_URL}/house`, { withCredentials: true });


export const getAllHostel = () =>
    axios.get(`${API_BASE_URL}/hostel`, { withCredentials: true });


