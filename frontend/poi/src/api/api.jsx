import axios from 'axios';
import { toast } from 'react-toastify';

const mode = import.meta.env.VITE_DEV_MODE === 'true';
const apiUrl = mode ? import.meta.env.VITE_BACKEND_LOCAL_URL
                    : import.meta.env.VITE_BACKEND_LIVE_URL;

const API = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = sessionStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const res = await API.post('/refresh-token', { refreshToken });
                const { token: newToken } = res.data;

                sessionStorage.setItem('token', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return API(originalRequest);
            } catch (err) {
                sessionStorage.clear();
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        const errorMessage = error.response?.data?.message || 'An error occurred';
        toast.error(errorMessage);
        return Promise.reject(error);
    }
);

// --- Auth APIs ---
export const Login = (email, password) => API.post('/login', { email, password });
export const LoginWithGoogle = (token) => API.post('/google-login', token)
export const Register = (userData) => API.post('/register', userData);
export const Logout = (refreshToken) => API.post('/logout', refreshToken);
export const GetProfile = () => API.get('/user-profile');
// --- Insight APIs ---
export const GetAllInsights = () => API.get('/insights');
export const CreateInsight = (data) => API.post('/insights/new', data);
export const GetInsightById = (id) => API.get(`/insights/${id}`);
export const VerfiyInsight = (hash) => API.post('/verify-insight', hash)
export const GetSummary = (data) => API.post('/get-summary', data);
export const GenerateInsightScores = (data) => API.post('/get-score', data);

export default API;