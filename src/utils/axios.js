import axios from "axios";

// En producción (Vercel): "/api" → Vercel proxea a render.com (cookies same-site).
// En local dev: VITE_BACK_URL puede apuntar directo al backend.
const BACK_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_BACK_URL || "/api")
  : "/api";

const api = axios.create({
  baseURL: BACK_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;