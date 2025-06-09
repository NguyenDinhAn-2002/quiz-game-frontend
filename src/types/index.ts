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

// Một người chơi trong phòng
export type Player = {
  id: string; // Socket ID hoặc UUID
  name: string;
  avatar: string;
  score: number;
  isHost?: boolean;
  hasAnswered?: boolean;
};

// Một câu hỏi


// Quiz: danh sách câu hỏi


// Một phòng chơi
export type Room = {
  id: string;
  hostId: string;
  players: Player[];
  quiz: Quiz;
  currentQuestionIndex: number;
  isStarted: boolean;
};

// Trả lời của người chơi
export type PlayerAnswer = {
  playerId: string;
  answerIndex: number;
  timeTaken: number; // giây
};

// Dữ liệu leaderboard
export type LeaderboardEntry = {
  name: string;
  avatar: string;
  score: number;
};

// Dữ liệu khởi tạo phòng (chọn quiz + tạo host)
export type CreateRoomPayload = {
  hostName: string;
  avatar: string;
  quizId: string;
};

// Dữ liệu tham gia phòng
export type JoinRoomPayload = {
  playerName: string;
  avatar: string;
  roomId: string;
};

// Gửi kết quả câu trả lời
export type AnswerSubmission = {
  playerId: string;
  answerIndex: number;
  timeTaken: number;
};
