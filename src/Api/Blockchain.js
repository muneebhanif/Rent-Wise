import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/auth/blockchain`;


export const getAggrementForAdminByOwnerIDs = () =>
  axios.get(`${API_BASE_URL}/admin/allAggremments`, { withCredentials: true });


export const MakeAggrementForAdminByOwnerIDs = (data) =>
  axios.post(`${API_BASE_URL}/admin/changeStatusOnBlockchain`,data, { withCredentials: true });

