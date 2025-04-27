import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Nếu dùng proxy thì chỉ cần '/api'
  withCredentials: true,
});

export const fetchQuizzes = async () => {
  const res = await API.get('/quiz');
  return res.data;
};

export const getQuizById = async (quizId: string) => {
  const res = await API.get(`/quiz/${quizId}`);
  return res.data;
};
