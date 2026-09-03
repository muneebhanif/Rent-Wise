import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/rentwise`;

export const getAllLists = () =>
  axios.get(`${API_BASE_URL}/admin/getAllLists`, { withCredentials: true });
export const getListingById = (id) =>
  axios.get(`${API_BASE_URL}/admin/getAllLists/${id}`, {
    withCredentials: true,
  });
export const deleteListing = (id) =>
  axios.delete(`${API_BASE_URL}/admin/deleteListing/${id}`, {
    withCredentials: true,
  });
export const getAllListsOFUser = () =>
  axios.get(`${API_BASE_URL}/admin/getAllListsOFUser`, {
    withCredentials: true,
  });
export const getAllListsOFUserById = (id) =>
  axios.get(`${API_BASE_URL}/admin/getAllListsOFUser/${id}`, {
    withCredentials: true,
  });
export const deleteUser = (id) =>
  axios.delete(`${API_BASE_URL}/admin/deleteUser/${id}`, {
    withCredentials: true,
  });
