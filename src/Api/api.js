import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/auth`;


export const register = (userData) =>
  axios.post(`${API_BASE_URL}/register`, userData, { withCredentials: true });

export const login = (credentials) =>
  axios.post(`${API_BASE_URL}/login`, credentials, { withCredentials: true });

export const forgetPassword = (email) =>
  axios.post(
    `${API_BASE_URL}/forget-password`,
    { email },
    { withCredentials: true }
  );

export const verifyOtp = (otpData) =>
  axios.post(`${API_BASE_URL}/verify-otp`, otpData, { withCredentials: true });

export const resetPassword = (passwordData) =>
  axios.post(`${API_BASE_URL}/reset-password`, passwordData, {
    withCredentials: true,
  });

export const getUserAccount = () =>
  axios.get(`${API_BASE_URL}/account`, { withCredentials: true });

export const logout = () =>
  axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });

export const User = () =>
  axios.get(`${API_BASE_URL}/user/check`, { withCredentials: true });

export const GoogleLoginRequest = async () => {
  try {
    window.location.href = `${API_BASE_URL}/google`;
  } catch (error) {
    console.error("Error initiating Google login", error);
    throw error;
  }
};