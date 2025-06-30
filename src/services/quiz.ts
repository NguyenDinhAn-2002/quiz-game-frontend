
import axios from 'axios';
import { QuizSummary, QuizDetail } from '../types/quiz';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const fetchQuizList = async (): Promise<QuizSummary[]> => {
  const res = await API.get('/quiz');
  // Transform the data to match QuizSummary interface
  return (res.data as any[]).map((quiz: any) => ({
    _id: quiz._id,
    title: quiz.title,
    thumbnail: quiz.thumbnail,
    tags: quiz.tags || [],
    questionCount: quiz.questions?.length || 0,
    description: quiz.description,
    createdBy: quiz.createdBy || '',
  }));
};

export const fetchQuizDetail = async (quizId: string): Promise<QuizDetail> => {
  const res = await API.get<QuizDetail>(`/quiz/${quizId}`);
  return {
    _id: res.data._id,
    title: res.data.title,
    tags: res.data.tags || [],
    questions: res.data.questions || [],
    description: res.data.description
  };
};

export const getTagById = async (tagId: string) => {
  const res = await API.get(`/tags/${tagId}`);
  return res.data;
};
