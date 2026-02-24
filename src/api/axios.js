import axios from "axios";

export const serverUrl = "http://localhost:8000";

const API = axios.create({
  baseURL: `${serverUrl}/api`,
  withCredentials: true 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;