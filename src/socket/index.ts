
import { io, Socket } from "socket.io-client";
import { PlayerInfo, Question, QuestionResult, ScoreboardData, FinalPlayer } from '../types';

interface Room {
  id: string;
  hostId: string;
  players: PlayerInfo[];
  quizData: any;
  currentQuestionIndex: number;
  paused: boolean;
  isStarted: boolean;
  questionTimeLimit: number;
  questionStartTime: number;
  totalQuestions: number;
  host: PlayerInfo | null;
}

const socket: Socket = io('http://localhost:5000', {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: false,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
};

// Host creates a new room
export const createRoom = (hostId: string, quizData: any) => {
  socket.emit('create-room', { hostId, quizData });
};

// Host reconnects to existing room (when asPlayer = false)
export const hostReconnect = (roomId: string, hostId: string) => {
  socket.emit('host-reconnect', { roomId, hostId });
};

// Player joins room or host joins as player
export const joinRoom = (roomId: string, player: {
  id: string;
  name: string;
  avatar: string;
}) => {
  socket.emit('join-room', { roomId, player });
};

export const leaveRoom = () => {
  socket.emit('leave-room');
};

export const startGame = (roomId: string, playerId: string) => {
  socket.emit('start-game', { roomId, playerId });
};

export const submitAnswer = (playerId: string, answer: any) => {
  socket.emit('submit-answer', { playerId, answer });
};

export const nextQuestion = (roomId: string, playerId: string) => {
  socket.emit('next-question', { roomId, playerId });
};

export const pauseGame = (roomId: string, playerId: string) => {
  socket.emit('pause-game', { roomId, playerId });
};

export const resumeGame = (roomId: string, playerId: string) => {
  socket.emit('resume-game', { roomId, playerId });
};

export const kickPlayer = (roomId: string, targetPlayerId: string, requesterId: string) => {
  socket.emit('kick-player', { roomId, targetPlayerId, requesterId });
};

// Event listeners
export const onRoomUpdated = (callback: (room: Room) => void) => {
  socket.on('room-updated', callback);
};

export const onNewQuestion = (callback: (data: {
  question: Question;
  index: number;
  timeLimit: number;
  questionStartTime: number;
}) => void) => {
  socket.on('new-question', callback);
};

export const onQuestionEnded = (callback: (data: {
  results: QuestionResult[];
  correctAnswer: string[];
  index: number;
}) => void) => {
  socket.on('question-ended', callback);
};

export const onScoreboard = (callback: (data: ScoreboardData) => void) => {
  socket.on('scoreboard', callback);
};

export const onGameEnded = (callback: (data: {
  finalLeaderboard: FinalPlayer[];
}) => void) => {
  socket.on('game-ended', callback);
};

export const onPauseGame = (callback: () => void) => {
  socket.on('pause-game', callback);
};

export const onResumeGame = (callback: (data: { remainingTime: number }) => void) => {
  socket.on('resume-game', callback);
};

export const onPlayerKicked = (callback: (data: { playerId: string }) => void) => {
  socket.on('player-kicked', callback);
};

export const onAnswerResult = (callback: (data: {
  result: string;
  score: number;
  correctAnswer: string[];
  playerAnswer: any;
}) => void) => {
  socket.on('answer-result', callback);
};

export const onError = (callback: (message: string) => void) => {
  socket.on('error', callback);
};

export const onConnect = (callback: () => void) => {
  socket.on('connect', callback);
};

export const onDisconnect = (callback: () => void) => {
  socket.on('disconnect', callback);
};

export const removeAllListeners = () => {
  socket.removeAllListeners();
};

export const cleanupRoomEvents = () => {
  socket.off('room-updated');
  socket.off('new-question');
  socket.off('question-ended');
  socket.off('scoreboard');
  socket.off('game-ended');
  socket.off('pause-game');
  socket.off('resume-game');
  socket.off('player-kicked');
  socket.off('answer-result');
  socket.off('error');
};

export default socket;