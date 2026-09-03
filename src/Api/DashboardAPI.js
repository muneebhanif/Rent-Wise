import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/dashboard`;

export const getUser = () =>
  axios.get(`${API_BASE_URL}/getUserDashboard`, { withCredentials: true });

export const updateUserDashboardProfile = async (id, formData) => {
  return await axios.put(`${API_BASE_URL}/updateUserDashboardProfile/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const ToGetReview = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews`, { withCredentials: true });
    return response; 
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const SetSubscriptionNotification = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save-subscription`,data, { withCredentials: true });
    return response;  
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
export const GetSubscriptionNotification = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-subscription`, { withCredentials: true });
    return response;  
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};



  