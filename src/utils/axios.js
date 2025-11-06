import axios from "axios";
const BACK_URL = import.meta.env.VITE_BACK_URL;
console.log(BACK_URL); // http://localhost:3000/api


const api = axios.create({
  baseURL: BACK_URL, // Base URL del backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // Header correcto para enviar JSON
  },
  withCredentials: true, // Permite el envío de cookies entre frontend y backend
});

export default api;