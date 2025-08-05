import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Change to your backend URL after deployment

// Automatically include JWT token in headers
const api = axios.create();

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getQuizzes = (type) => api.get(`/quizzes/${type}`);
export const submitQuiz = (result) => api.post('/quizzes/submit', result);
export const getResults = () => api.get('/quizzes/results');
export const getLeaderboard = () => api.get('/quizzes/leaderboard');
export const getUsers = () => api.get('/users');

export default api;
