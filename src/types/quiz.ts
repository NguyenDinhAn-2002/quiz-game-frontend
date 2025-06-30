// QUIZZES
export interface Quiz {
  _id: string;
  title: string;
  thumbnail?: string;
  questions: Question[];
  tag: Tag;
  description?: string;
  createdBy: string;
}

export interface QuizSummary {
  _id: string;
  title: string;
  thumbnail?: string;
  tags: string[];
  questionCount: number;
  description?: string;
}

export interface QuizDetail {
  _id: string;
  title: string;
  tags: (string | Tag)[];
  questions: Question[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: User | string;
}

// QUESTIONS
export type MediaType = 'image' | 'audio' | 'video' | 'text';
export type QuestionType = 'single' | 'multiple' | 'order' | 'input';

export interface Question {
  _id: string;
  quizId: string;
  questionText: string;
  media: {
    type: MediaType;
    url?: string;
  };
  questionType: QuestionType;
  options: Option[];
  timeLimit: number;
}

// OPTIONS
export interface Option {
  _id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
}

// TAGS
export interface Tag {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// GAME STATE
export interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  score: number;
  answered: boolean;
  answer: any;
  isHost: boolean;
  isConnected: boolean;
}

export interface RoomState {
  id: string;
  hostId: string;
  isStarted: boolean;
  paused: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionTimeLimit: number;
  questionStartTime: number;
  players: PlayerInfo[];
  quizData: QuizDetail | null;
  host: PlayerInfo | null;
}

export interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
  role: "host" | "player";
  asPlayer: boolean;
}

export interface FinalPlayer {
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
}


export interface Question {
  _id: string;
  quizId: string;
  questionText: string;
  media: {
    type: MediaType;
    url?: string;
  };
  questionType: QuestionType;
  options: Option[];
  timeLimit: number;
}

// OPTIONS
export interface Option {
  _id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
}

// TAGS
export interface Tag {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// GAME STATE
export interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  score: number;
  answered: boolean;
  answer: any;
  isHost: boolean;
  isConnected: boolean;
}

export interface RoomState {
  id: string;
  hostId: string;
  isStarted: boolean;
  paused: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionTimeLimit: number;
  questionStartTime: number;
  players: PlayerInfo[];
  quizData: QuizDetail | null;
  host: PlayerInfo | null;
}

export interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
  role: "host" | "player";
  asPlayer: boolean;
}

export interface FinalPlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  totalScore: number;
}

export interface AnswerResult {
  result: "Đúng" | "Sai";
  score: number;
  correctAnswer: string[];
  playerAnswer: any;
}

export interface QuestionResult {
  playerId: string;
  name: string;
  avatar?: string;
  answer: any;
  isCorrect: boolean;
  score: number;
  totalScore: number;
}

export interface ScoreboardData {
  players: {
    playerId: string;
    name: string;
    avatar?: string;
    totalScore: number;
    score: number;
  }[];
}