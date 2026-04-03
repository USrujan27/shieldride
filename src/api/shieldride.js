import axios from 'axios';

// All calls go to /api — Vite proxy forwards to http://localhost:5000
const api = axios.create({ baseURL: '/api', timeout: 10000 });

// ── Worker ──────────────────────────────────────────────────────────────────
export const registerWorker = (data) => api.post('/worker/register', data);

// ── Policy ──────────────────────────────────────────────────────────────────
export const activatePolicy = (data)     => api.post('/policy/activate', data);
export const getWorkerPolicy = (workerId) => api.get(`/policy/${workerId}`);

// ── Weather ─────────────────────────────────────────────────────────────────
export const getWeather = (city) => api.get(`/weather/${city}`);

// ── Claims ──────────────────────────────────────────────────────────────────
export const initiateClaim = (data) => api.post('/claims/initiate', data);

// ── Payout ──────────────────────────────────────────────────────────────────
export const sendPayout = (data) => api.post('/payout/send', data);

// ── Health check ─────────────────────────────────────────────────────────────
export const checkHealth = () => api.get('/health');
