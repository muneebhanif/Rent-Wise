import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/listings`

// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const getAllListingAPI = () =>
  axios.get(`${API_BASE_URL}/all`, { withCredentials: true });

export const uploadMediaAPI = (formData) =>
  axios.post(`${API_BASE_URL}/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  export const getOneUserListingAPI = (id) =>
    axios.get(`${API_BASE_URL}/GetListingsById/${id}`, { withCredentials: true });


  //to get all listings by a specific user (by user ID)
export const getAlListingsofSpecificUser = (id) =>
  axios.get(`${API_BASE_URL}/user/${id}`, { withCredentials: true });

export const Updatelistings = (id, data) =>
  axios.put(`${API_BASE_URL}/update/${id}`, data, { withCredentials: true });



export const PlaceBid = (data) =>
  axios.post(`${API_BASE_URL}/placeBid`, data, { withCredentials: true });
  

export const AddFav = (id) =>
  axios.post(`${API_BASE_URL}/favorites/${id}`, {}, { withCredentials: true });


export const GetFav = () =>
  axios.get(`${API_BASE_URL}/favorites`, { withCredentials: true });
  




  