
import { io, Socket } from 'socket.io-client';
import { Room, Player } from '../types';

let socket: Socket | null = null;

const SOCKET_URL = 'http://localhost:5000';

const createSocketConnection = (): Socket => {
  return io(SOCKET_URL, {
    transports: ['websocket'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
};

export const getSocket = (): Socket => {
  if (!socket) {
    socket = createSocketConnection();

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected with ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket.IO] Connection error:', err.message);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = (
  event: string,
  data: any,
  callback?: (response: any) => void
) => {
  getSocket().emit(event, data, callback);
};

// ========== Emit Actions ==========

export const createRoomAsHost = (
  data: { quizId: string; asPlayer: boolean },
  callback?: (response: any) => void
) => {
  emitEvent('host-create-room', data, callback);
};

export const reconnectAsHost = (
  data: { pin: string; hostId: string; quizId: string },
  callback?: (response: any) => void
) => {
  emitEvent('host-reconnect', data, callback);
};

export const reconnectAsPlayer = (
  data: { pin: string; oldSocketId: string; name: string; avatar: string },
  callback?: (response: any) => void
) => {
  emitEvent('player-reconnect', data, callback);
};

export const joinRoomAsPlayer = (
  data: { pin: string; name: string; avatar: string },
  callback?: (response: any) => void
) => {
  emitEvent('player-join-room', data, callback);
};

export const startGameInRoom = (data: { pin: string }) => {
  emitEvent('start-game', data);
};

export const submitAnswerInRoom = (
  data: { pin: string; correct: boolean },
  callback?: (response: any) => void
) => {
  emitEvent('submit-answer', data, callback);
};

export const moveToNextQuestion = (data: { pin: string }) => {
  emitEvent('next-question', data);
};

export const kickPlayerFromRoom = (
  data: { pin: string; targetSocketId: string },
  callback?: (response: any) => void
) => {
  emitEvent('kick-player', data, callback);
};

export const pauseGame = (data: { pin: string; isPaused: boolean }) => {
  emitEvent('pause-game', data);
};

export const leaveRoom = (pin: string) => {
  emitEvent('leave-room', { pin });
};

// ========== Listen Events ==========

export const onRoomUpdated = (callback: (room: Room) => void) => {
  getSocket().on('room-updated', callback);
};

export const onGameStarted = (callback: (room: Room) => void) => {
  getSocket().on('game-started', callback);
};

export const onAllAnswersSubmitted = (
  callback: (data: { player: Player; correct: boolean }) => void
) => {
  getSocket().on('all-answers-submitted', callback);
};

export const onNextQuestion = (callback: (currentQuestion: number) => void) => {
  getSocket().on('next-question', callback);
};

export const onGamePaused = (callback: (isPaused: boolean) => void) => {
  getSocket().on('game-paused', callback);
};

export const onKicked = (callback: () => void) => {
  getSocket().on('kicked', callback);
};

// Clear all listeners (useful on cleanup)
export const removeListeners = () => {
  if (!socket) return;
  socket.removeAllListeners();
};