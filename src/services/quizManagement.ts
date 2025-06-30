import axios from 'axios';
import { QuizDetail } from '../types/quiz';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateQuizRequest {
  title: string;
  description?: string;
  questions: Array<{
    questionText: string;
    questionType: 'single' | 'multiple' | 'order' | 'input';
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
    timeLimit: number;
    media?: {
      type: 'text' | 'image' | 'audio' | 'video';
      url?: string;
    };
  }>;
  tags?: string[];
  thumbnail?: File;
}

export interface CreateAIQuizRequest {
  topic: string;
  numQuestions: number;
  tags?: string[];
}

export const quizManagementService = {

  createQuiz: async (data: CreateQuizRequest): Promise<QuizDetail> => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('questions', JSON.stringify(data.questions));
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

    const response = await API.post<QuizDetail>('/quiz', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },


  createQuizWithFormData: async (payload: FormData): Promise<QuizDetail> => {
    const response = await API.post<QuizDetail>('/quiz', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createAIQuiz: async (data: CreateAIQuizRequest): Promise<QuizDetail> => {
    const response = await API.post<{ data: QuizDetail }>('/quiz/generate-ai', data);
    return response.data.data;
  },

  getUserQuizzes: async (): Promise<QuizDetail[]> => {
    const response = await API.get('/quiz');
    const token = localStorage.getItem('token');
    if (!token) return [];
    
    // Decode token để lấy user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    
    // Filter quizzes by current user
    const quizzes = response.data as any[];
    return quizzes.filter((quiz: any) => 
      quiz.createdBy && (quiz.createdBy._id === userId || quiz.createdBy === userId)
    );
  },

  deleteQuiz: async (quizId: string): Promise<void> => {
    await API.delete(`/quiz/${quizId}`);
  }
};
