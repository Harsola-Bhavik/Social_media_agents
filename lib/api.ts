import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  return api.post('/register', userData);
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  return api.post('/login', credentials);
};

// YouTube Agent API
export const summarizeYouTubeVideo = async (url: string) => {
  return api.post('/youtube/summarize', { url });
};

export const askYouTubeQuestion = async (videoId: string, question: string) => {
  return api.post('/youtube/question', { videoId, question });
};

// Research AI API
export const generateResearchPaper = async (params: {
  topic: string;
  paperType: string;
  wordCount: string;
  includeSources: boolean;
  includeCharts: boolean;
}) => {
  return api.post('/research/generate', params);
};

// Twitter Agent API
export const generateTwitterContent = async (params: {
  topic: string;
  audience: string;
  tone: string;
  count: number;
}) => {
  return api.post('/twitter/generate', params);
};

// User Activities API
export const getUserActivities = async () => {
  return api.get('/activities');
};

export default api;