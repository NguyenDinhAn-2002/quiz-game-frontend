// USERS
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional for local registration
  avatar?: string;
  provider: 'local' | 'google';
  createdAt?: string;
  updatedAt?: string;
}

// QUIZZES
export interface Quiz {
  _id: string;
  title: string;
  thumbnail?: string;
  tag: Tag;
  questions: Question[];
  description?: string;
  createdBy: string;
}

// QUESTIONS
export type MediaType = 'image' | 'audio' | 'video' | 'text';
export type QuestionType = 'single' | 'multiple' | 'order' | 'input';

export interface Question {
  _id: string;             // Unique identifier for the question
  quizId: string;        // The ID of the quiz to which the question belongs
  questionText: string;   // The question text
  media: {                // The media associated with the question
    type: MediaType;
    url?: string;         // Optional URL for media (image, video, etc.)
  };
  questionType: QuestionType;  // Type of the question ('single', 'multiple', etc.)
  options: Option[];      // Array of options for the question
  timeLimit: number;      // Time limit for answering (between 5 and 90 seconds)
}

// OPTIONS interface
export interface Option {
  _id: string;            // Unique identifier for the option
  questionId: string;   // The ID of the question this option belongs to
  text: string;          // The text of the option
  isCorrect: boolean;    // Whether this option is correct or not
}

// TAGS
export interface Tag {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// GAME RELATED
export interface Player {
  socketId: string;
  name: string;
  avatar: string;
  score: number;
  isHost: boolean;
  isConnected: boolean; // Added isConnected status
}

export interface Room {
  quizId: string;
  hostId: string;
  isStarted: boolean;
  currentQuestion: number;
  players: Player[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  role: 'host' | 'player';
  pin?: string;
  hostId?: string;
  asPlayer: boolean;
  quizId?: string;
  previousSocketId?: string; // Added to track previous socket ID for reconnection
}

export enum GamePhase {
  LOBBY = 'lobby',
  PLAYING = 'playing',
  RESULTS = 'results'
}

export interface AvatarParts {
  hat: string;
  glasses: string;
  expression: string;
  background: string;
}