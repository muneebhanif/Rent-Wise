

import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/comments`;


// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const AddComment = (data) =>
    axios.post(`${API_BASE_URL}/createListingComment`, data, { withCredentials: true });


export const AddReply = (data) =>
    axios.post(`${API_BASE_URL}/reply`, data, { withCredentials: true });


export const getComments = (ListingId) =>
    axios.get(`${API_BASE_URL}/showSpecificListComments/${ListingId}`, { withCredentials: true });


export const getCommentswithReplies = (ListingId) =>
    axios.get(`${API_BASE_URL}/CommentWithReply/${ListingId}`, { withCredentials: true });

export const deleteComment = (commentId) =>
    axios.delete(`${API_BASE_URL}/deleteComment/${commentId}`, { withCredentials: true });

export const deleteReply = (replyId) =>
    axios.delete(`${API_BASE_URL}/deleteReply/${replyId}`, { withCredentials: true });

