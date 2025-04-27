// USERS
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for local registration
  avatar?: string;
  provider: 'local' | 'google';
  created_at?: string;
  updated_at?: string;
}

// QUIZZES
export interface Quiz {
  _id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

// QUESTIONS
export type MediaType = 'image' | 'audio' | 'video' | 'text';
export type QuestionType = 'single' | 'multiple' | 'order' | 'input';

export interface Question {
  id: string;             // Unique identifier for the question
  quiz_id: string;        // The ID of the quiz to which the question belongs
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
  id: string;            // Unique identifier for the option
  question_id: string;   // The ID of the question this option belongs to
  text: string;          // The text of the option
  isCorrect: boolean;    // Whether this option is correct or not
}

// TAGS
export interface Tag {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// QUIZ_TAGS (many-to-many relation)
export interface QuizTag {
  quiz_id: string;
  tag_id: string;
}

// GAME TYPES
export interface Player {
  socketId: string;
  name: string;
  avatar: string;
  score: number;
  isHost: boolean;
}

export interface Room {
  quizId: string;
  hostId: string;
  isStarted: boolean;
  currentQuestion: number;
  players: Player[];
}

// AVATAR CUSTOMIZATION
export interface AvatarParts {
  baseColor: string;
  hat?: string;
  eyes: string;
  mouth: string;
  accessory?: string;
}
