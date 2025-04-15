// src/types.ts

// Interface người dùng
export interface IUser {
    id?: string;               // Có nếu là user đăng nhập từ server
    username: string;          // Bắt buộc (dùng cả cho guest và user)
    email?: string;            // Chỉ có đối với người dùng đăng nhập
    googleId?: string;         // Nếu đăng nhập qua Google
    guest?: boolean;           // true nếu là guest
    avatar?: string;
    createdAt?: Date;
  }
  
  // Interface cho câu hỏi
  export interface IQuestion {
    id?: string;
    questionText?: string;
    type: 'text' | 'image' | 'audio' | 'video';
    mediaUrl?: string;
    options?: string[];
    correctAnswer: string | number;
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    createdAt?: Date;
  }
  
  // Interface cho Quiz
  export interface IQuiz {
    id?: string;
    host: IUser;
    title: string;
    description?: string;
    category?: string;
    settings?: {
      timePerQuestion: number;
      randomizeQuestions: boolean;
    };
    questions: IQuestion[];
    createdAt?: Date;
  }
  
  // Interface cho Room (phòng chơi)
  export interface IRoom {
    id?: string;
    quiz: IQuiz;
    host: IUser;
    players: Array<{
      user?: IUser; // Nếu người chơi đăng nhập
      username: string;
      score: number;
    }>;
    currentQuestion: number;
    status: 'waiting' | 'playing' | 'finished';
    createdAt?: Date;
  }
  