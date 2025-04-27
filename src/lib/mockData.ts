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

// src/data/mockData.ts

export const TAGS = [
  { id: 'math', name: 'Math', color: '#F59E0B' },
  { id: 'science', name: 'Science', color: '#10B981' },
  { id: 'history', name: 'History', color: '#6366F1' },
];

export const QUIZZES = [
  {
    id: '1',
    title: 'Algebra Basics',
    description: 'Test your knowledge of basic algebra.',
    imageUrl: '',
    questions: [{ id: 'q1', questionText: 'What is x in 2x=6?' }],
    tagId: 'math',
  },
  {
    id: '2',
    title: 'World War II',
    description: 'A quiz on major events in WWII.',
    imageUrl: '',
    questions: [{ id: 'q2', questionText: 'When did WWII end?' }],
    tagId: 'history',
  },
];
export const avatarColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFD166', // Yellow
  '#6B5B95', // Purple
  '#88D8B0', // Green
  '#FF8C94', // Pink
  '#FFAAA5', // Salmon
  '#B5EAD7', // Mint
  '#C7CEEA', // Light Blue
  '#F6EAC2', // Cream
];

export const avatarHats = [
  'none',
  'partyHat',
  'cowboyHat',
  'propellerHat',
  'crown',
  'wizard',
];

export const avatarEyes = [
  'normal',
  'happy',
  'wink',
  'surprised',
  'sleepy',
  'angry',
];

export const avatarMouths = [
  'smile',
  'grin',
  'surprised',
  'neutral',
  'sad',
];

export const avatarAccessories = [
  'none',
  'glasses',
  'sunglasses',
  'mustache',
  'bow',
];
