import axios from "axios";

// Centralized API instance — reads base URL from .env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://job-portal-backend-fq1h.onrender.com",
});

// Auto-attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth APIs ────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);
export const getMe = () => API.get("/api/auth/me");

// ─── Jobs APIs ────────────────────────────────────────────────────────────────
export const getAllJobs = () => API.get("/api/jobs");
export const getJobById = (id) => API.get(`/api/jobs/${id}`);
export const createJob = (data) => API.post("/api/jobs", data);
export const updateJob = (id, data) => API.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/api/jobs/${id}`);

// ─── Applications APIs ────────────────────────────────────────────────────────
export const applyToJob = (jobId) => API.post("/api/applications/apply", { jobId });
export const getMyApplications = () => API.get("/api/applications/my");

export default API;
