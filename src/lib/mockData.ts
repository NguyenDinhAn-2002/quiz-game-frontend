// src/mockData.ts

import { IQuiz, IQuestion, IUser } from './types';

// Guest user mẫu
export const guestUser: IUser = {
  username: 'Guest-' + Math.floor(Math.random() * 10000),
  guest: true,
};

// Một số câu hỏi mẫu
const sampleQuestions: IQuestion[] = [
  {
    id: 'q1',
    questionText: "What's the capital of France?",
    type: 'text',
    options: ['Paris', 'London', 'Rome', 'Berlin'],
    correctAnswer: 0, // index 0: Paris
    difficulty: 'easy',
    category: 'Geography',
  },
  {
    id: 'q2',
    questionText: 'Identify this image?',
    type: 'image',
    mediaUrl: 'https://example.com/path/to/image.jpg',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'General Knowledge',
  },
  {
    id: 'q3',
    questionText: 'Listen to the audio and answer the question.',
    type: 'audio',
    mediaUrl: 'https://example.com/path/to/audio.mp3',
    options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
    correctAnswer: 'Answer B',
    difficulty: 'hard',
    category: 'Music',
  },
];

// Quiz mẫu
export const sampleQuiz: IQuiz = {
  id: 'quiz1',
  host: {
    id: 'user1',
    username: 'AdminUser',
    email: 'admin@example.com',
    guest: false,
  },
  title: 'Sample General Quiz',
  description: 'A sample quiz for testing purposes.',
  category: 'General',
  settings: {
    timePerQuestion: 30,
    randomizeQuestions: false,
  },
  questions: sampleQuestions,
  createdAt: new Date(),
};

// Mảng quiz mẫu
export const quizList: IQuiz[] = [
  sampleQuiz,
  // Có thể thêm các quiz khác nếu cần
];
