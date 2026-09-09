import axios from "axios";
import { getAuthConfig } from "./api";

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/agreement`

export const createAgreement = (payload) =>
  axios.post(`${API_BASE_URL}/createAggreement`, payload, getAuthConfig());


export const SentAggreement = (payload) => 
  axios.post(`${API_BASE_URL}/sentaggreement`, payload, getAuthConfig());

export const GetAggreements = () => 
  axios.get(`${API_BASE_URL}/GetByOwnerId`, getAuthConfig());


export const GetAggreementsByID = (aggId) => {
  return axios.post(`${API_BASE_URL}/getAggrementDetails`, {aggId}, getAuthConfig());
};


export const VerifyAggrementByRenter = (payload) => 
  axios.post(`${API_BASE_URL}/VerifyAggrementByRenter`, payload, getAuthConfig());

export const UpdateAggrementByOwner = (payload) => 
  axios.post(`${API_BASE_URL}/updateAggreementByOwner`, payload, getAuthConfig());

export const requestAgreementCancellation = (payload) =>
  axios.post(`${API_BASE_URL}/requestCancellation`, payload, getAuthConfig());

export const confirmAgreementCancellation = (payload) =>
  axios.post(`${API_BASE_URL}/confirmCancellation`, payload, getAuthConfig());

export const declineAgreementCancellation = (payload) =>
  axios.post(`${API_BASE_URL}/declineCancellation`, payload, getAuthConfig());
