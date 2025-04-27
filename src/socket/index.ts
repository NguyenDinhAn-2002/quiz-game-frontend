// Cấu hình kết nối Socket.IO client
import { io, Socket } from 'socket.io-client';

// Types bạn có thể import từ '../types' như trước
import { Room, Player } from '../types';

let socket: Socket | null = null;

// Kết nối socket thật
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'], // Ép dùng websocket
      withCredentials: true,     // Cho phép gửi cookie nếu cần
      reconnection: true,        // Tự động reconnect
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

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


// Ngắt kết nối
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Các hàm emit tiện lợi (cho dễ dùng ở Frontend)

export const hostCreateRoom = (
  data: { quizId: number; name: string; avatar: string; asPlayer: boolean },
  callback?: (response: any) => void
) => {
  getSocket().emit('host-create-room', data, callback);
};

export const playerJoinRoom = (
  data: { pin: string; name: string; avatar: string },
  callback?: (response: any) => void
) => {
  getSocket().emit('player-join-room', data, callback);
};

export const startGame = (
  data: { pin: string }
) => {
  getSocket().emit('start-game', data);
};

export const submitAnswer = (
  data: { pin: string; answer: any },
  callback?: (response: any) => void
) => {
  getSocket().emit('submit-answer', data, callback);
};

export const nextQuestion = (
  data: { pin: string }
) => {
  getSocket().emit('next-question', data);
};

export const kickPlayer = (
  data: { pin: string; targetSocketId: string },
  callback?: (response: any) => void
) => {
  getSocket().emit('kick-player', data, callback);
};

// Các hàm lắng nghe sự kiện server gửi về

export const onRoomUpdated = (callback: (room: Room) => void) => {
  getSocket().on('room-updated', callback);
};

export const onGameStarted = (callback: (room: Room) => void) => {
  getSocket().on('game-started', callback);
};

export const onAllAnswersSubmitted = (callback: (data: { player: Player, correct: boolean }) => void) => {
  getSocket().on('all-answers-submitted', callback);
};

export const onNextQuestion = (callback: (currentQuestion: number) => void) => {
  getSocket().on('next-question', callback);
};
