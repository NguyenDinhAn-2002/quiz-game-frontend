
import { create } from 'zustand';
import { RoomState, CurrentUser, QuizSummary, Question, AnswerResult, FinalPlayer, ScoreboardData } from '../types';
import socket from '../socket';

interface GameState {
  // Core state
  room: RoomState | null;
  currentUser: CurrentUser | null;
  quizList: QuizSummary[];
  currentQuestion: Question | null;
  answerResult: AnswerResult | null;
  finalLeaderboard: FinalPlayer[];
  scoreboard: ScoreboardData | null;
  
  // UI state
  phase: "lobby" | "playing" | "result";
  isConnected: boolean;
  showScoreboard: boolean;
  
  // Force update counter to trigger re-renders
  updateCounter: number;
  
  // Actions
  setRoom: (room: RoomState) => void;
  setCurrentUser: (user: CurrentUser) => void;
  setQuizList: (list: QuizSummary[]) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setAnswerResult: (result: AnswerResult | null) => void;
  setFinalLeaderboard: (leaderboard: FinalPlayer[]) => void;
  setScoreboard: (scoreboard: ScoreboardData | null) => void;
  setPhase: (phase: "lobby" | "playing" | "result") => void;
  setIsConnected: (connected: boolean) => void;
  setShowScoreboard: (show: boolean) => void;
  forceUpdate: () => void;
  
  // Game actions
  submitAnswer: (answer: any) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  nextQuestion: () => void;
  kickPlayer: (playerId: string) => void;
  leaveRoom: () => void;
  
  // Utils
  clearGameState: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  room: null,
  currentUser: null,
  quizList: [],
  currentQuestion: null,
  answerResult: null,
  finalLeaderboard: [],
  scoreboard: null,
  phase: "lobby",
  isConnected: false,
  showScoreboard: false,
  updateCounter: 0,
  
  // Setters
  setRoom: (room) => {
    console.log('GameStore: Setting room:', room);
    set((state) => ({ 
      room, 
      updateCounter: state.updateCounter + 1 
    }));
  },
  
  setCurrentUser: (user) => {
    console.log('GameStore: Setting current user:', user);
    set((state) => ({ 
      currentUser: user, 
      updateCounter: state.updateCounter + 1 
    }));
  },
  
  setQuizList: (list) => set((state) => ({ 
    quizList: list, 
    updateCounter: state.updateCounter + 1 
  })),
  
  setCurrentQuestion: (question) => {
    console.log('GameStore: Setting current question:', question);
    set((state) => ({ 
      currentQuestion: question, 
      updateCounter: state.updateCounter + 1 
    }));
  },
  
  setAnswerResult: (result) => {
    console.log('GameStore: Setting answer result:', result);
    set((state) => ({ 
      answerResult: result, 
      updateCounter: state.updateCounter + 1 
    }));
  },
  
  setFinalLeaderboard: (leaderboard) => {
    console.log('GameStore: Setting final leaderboard:', leaderboard);
    set((state) => ({ 
      finalLeaderboard: leaderboard, 
      updateCounter: state.updateCounter + 1 
    }));
  },
  
  setScoreboard: (scoreboard) => {
    console.log('GameStore: Setting scoreboard:', scoreboard);
    set((state) => ({ 
      scoreboard: scoreboard, 
      updateCounter: state.updateCounter + 1 
    }));
  },
  
  setPhase: (phase) => {
    console.log('GameStore: Setting phase to:', phase);
    set((state) => ({ 
      phase, 
      updateCounter: state.updateCounter + 1 
    }));
  },
  
  setIsConnected: (connected) => set((state) => ({ 
    isConnected: connected, 
    updateCounter: state.updateCounter + 1 
  })),
  
  setShowScoreboard: (show) => set((state) => ({ 
    showScoreboard: show, 
    updateCounter: state.updateCounter + 1 
  })),
  
  forceUpdate: () => set((state) => ({ 
    updateCounter: state.updateCounter + 1 
  })),
  
  // Game actions
  submitAnswer: (answer) => {
    const { currentUser } = get();
    if (currentUser) {
      socket.emit('submit-answer', { playerId: currentUser.id, answer });
    }
  },
  
  startGame: () => {
    const { room, currentUser } = get();
    if (room && currentUser) {
      socket.emit('start-game', { roomId: room.id, playerId: currentUser.id });
    }
  },
  
  pauseGame: () => {
    const { room, currentUser } = get();
    if (room && currentUser) {
      console.log('GameStore: Emitting pause-game');
      socket.emit('pause-game', { roomId: room.id, playerId: currentUser.id });
    }
  },
  
  resumeGame: () => {
    const { room, currentUser } = get();
    if (room && currentUser) {
      console.log('GameStore: Emitting resume-game');
      socket.emit('resume-game', { roomId: room.id, playerId: currentUser.id });
    }
  },
  
  nextQuestion: () => {
  const { room, currentUser } = get();
  console.log('Emitting next-question with:', {
    roomId: room?.id,
    playerId: currentUser?.id,
    hostId: room?.hostId
  });
  if (room && currentUser) {
    socket.emit('next-question', { roomId: room.id, playerId: currentUser.id });
  }
}
,
  
  kickPlayer: (playerId) => {
    const { room, currentUser } = get();
    if (room && currentUser) {
      socket.emit('kick-player', { 
        roomId: room.id, 
        targetPlayerId: playerId, 
        requesterId: currentUser.id 
      });
    }
  },
  
  leaveRoom: () => {
    socket.emit('leave-room');
    // Clear localStorage
    localStorage.removeItem('roomId');
    localStorage.removeItem('playerId');
    localStorage.removeItem('role');
    localStorage.removeItem('asPlayer');
    localStorage.removeItem('name');
    localStorage.removeItem('avatar');
    // Clear state
    set({
      room: null,
      currentUser: null,
      currentQuestion: null,
      answerResult: null,
      finalLeaderboard: [],
      scoreboard: null,
      phase: "lobby",
      showScoreboard: false,
      updateCounter: 0
    });
  },
  
  clearGameState: () => {
    set({
      room: null,
      currentUser: null,
      currentQuestion: null,
      answerResult: null,
      finalLeaderboard: [],
      scoreboard: null,
      phase: "lobby",
      showScoreboard: false,
      updateCounter: 0
    });
  }
}));