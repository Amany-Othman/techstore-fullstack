import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000",
  baseURL: "https://techstore-fullstack-production.up.railway.app",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;