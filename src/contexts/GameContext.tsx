import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSocket, disconnectSocket } from '../socket';
import { Room, Player, AvatarParts } from '../types';
import { useToast } from '@/hooks/use-toast';

interface GameContextType {
  pin: string | null;
  setPin: (pin: string | null) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  room: Room | null;
  isHost: boolean;
  isInGame: boolean;
  currentQuestion: number;
  setCurrentQuestion: (num: number) => void;
  musicEnabled: boolean;
  toggleMusic: () => void;
  fullscreenEnabled: boolean;
  toggleFullscreen: () => void;
  joinRoom: (pin: string, name: string, avatar: string) => Promise<boolean>;
  createRoom: (quizId: string, name: string, avatar: string, asPlayer: boolean) => Promise<string | null>;
  startGame: () => void;
  submitAnswer: (correct: boolean) => void;
  nextQuestion: () => void;
  kickPlayer: (socketId: string) => Promise<boolean>;
  leaveRoom: () => void;
  isSocketConnected: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [pin, setPin] = useState<string | null>(localStorage.getItem('quiz_pin'));
  const [playerName, setPlayerName] = useState<string>(localStorage.getItem('quiz_player_name') || '');
  const [avatar, setAvatar] = useState<string>(localStorage.getItem('quiz_avatar') || '');
  const [room, setRoom] = useState<Room | null>(null);
  const [isInGame, setIsInGame] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(localStorage.getItem('quiz_music_enabled') !== 'false');
  const [fullscreenEnabled, setFullscreenEnabled] = useState<boolean>(false);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  
  const { toast } = useToast();

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    const handleConnect = () => {
      console.log('Socket connected');
      setIsSocketConnected(true);
    };
  
    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsSocketConnected(false);
    };
  
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
  
    // Đảm bảo kiểm tra trạng thái hiện tại khi load lại trang
    if (socket.connected) setIsSocketConnected(true);
    // Room updates
    socket.on('room-updated', (updatedRoom: Room) => {
      console.log('Room updated:', updatedRoom);
      setRoom(updatedRoom);
    });
    
    // Game started
    socket.on('game-started', (gameRoom: Room) => {
      console.log('Game started:', gameRoom);
      setRoom(gameRoom);
      setIsInGame(true);
      setCurrentQuestion(0);
      toast({
        title: "Game started!",
        description: "The quiz is now beginning. Good luck!",
      });
    });
    
    // Next question
    socket.on('next-question', (questionNumber: number) => {
      console.log('Next question:', questionNumber);
      setCurrentQuestion(questionNumber);
    });
    
    // All answers submitted
    socket.on('all-answers-submitted', (data: { player: Player, correct: boolean }) => {
      console.log('All answers submitted:', data);
      // Update UI or show feedback
      if (data.correct) {
        toast({
          title: "Correct!",
          description: "You got it right! +1 point",
        });
      } else {
        toast({
          title: "Wrong!",
          description: "Better luck on the next question",
        });
      }
    });
    
    // Kicked from room
    socket.on('kicked', () => {
      toast({
        title: "You've been kicked from the room",
        description: "The host has removed you from the game.",
        variant: "destructive",
      });
      handleLeaveRoom();
    });
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
  
     
    };
  }, []);
  
  // Save persistent data to localStorage
  useEffect(() => {
    if (pin) {
      localStorage.setItem('quiz_pin', pin);
    } else {
      localStorage.removeItem('quiz_pin');
    }
  }, [pin]);
  
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('quiz_player_name', playerName);
    }
  }, [playerName]);
  
  useEffect(() => {
    if (avatar) {
      localStorage.setItem('quiz_avatar', avatar);
    }
  }, [avatar]);
  
  useEffect(() => {
    localStorage.setItem('quiz_music_enabled', musicEnabled.toString());
  }, [musicEnabled]);
  
  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreenEnabled(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreenEnabled(false);
      }
    }
  };
  
  // Check if user is host
  const isHost = !!room?.players.find(p => p.isHost && p.socketId === getSocket().id);
  
  // Join existing room
  const joinRoom = async (pin: string, name: string, avatar: string): Promise<boolean> => {
    return new Promise((resolve) => {
      getSocket().emit('player-join-room', { pin, name, avatar }, (response: any) => {
        if (response.success) {
          setPin(pin);
          setPlayerName(name);
          setAvatar(avatar);
          resolve(true);
        } else {
          toast({
            title: "Failed to join room",
            description: response.error || "Something went wrong",
            variant: "destructive",
          });
          resolve(false);
        }
      });
    });
  };
  
  // Create new room
  const createRoom = async (quizId: string, name: string, avatar: string, asPlayer: boolean): Promise<string | null> => {
    return new Promise((resolve) => {
      const socket = getSocket(); // Lấy socket client
  
      if (!socket) {
        console.error('Socket not initialized');
        resolve(null);
        return;
      }
  
      console.log('Emitting host-create-room with data:', { quizId, name, avatar, asPlayer });
  
      // Gửi sự kiện host-create-room đến server và nhận phản hồi
      socket.timeout(5000).emit('host-create-room', { quizId, name, avatar, asPlayer }, (err: any, response: any) => {
        if (err) {
          console.error('Error or timeout during host-create-room:', err);
          toast({
            title: "Failed to create room (timeout)",
            description: "Server did not respond in time.",
            variant: "destructive",
          });
          resolve(null);
          return;
        }
  
        console.log('Response from host-create-room:', response);
  
        if (response?.pin) {
          setPin(response.pin); // Lưu PIN vào state
          setPlayerName(name);  // Lưu tên người chơi vào state
          setAvatar(avatar);    // Lưu avatar vào state
          resolve(response.pin); // Trả về PIN
        } else {
          toast({
            title: "Failed to create room",
            description: response?.error || "Unknown error",
            variant: "destructive",
          });
          resolve(null);
        }
      });
    });
  };
  
  // Start game
  const startGame = () => {
    if (pin && isHost) {
      getSocket().emit('start-game', { pin });
    }
  };
  
  // Submit answer
  const submitAnswer = (correct: boolean) => {
    if (pin && isInGame) {
      getSocket().emit('submit-answer', { pin, correct });
    }
  };
  
  // Next question
  const nextQuestion = () => {
    if (pin && isHost && isInGame) {
      getSocket().emit('next-question', { pin });
    }
  };
  
  // Kick player
  const kickPlayer = async (targetSocketId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (pin && isHost) {
        getSocket().emit('kick-player', { pin, targetSocketId }, (response: any) => {
          if (response.success) {
            resolve(true);
          } else {
            toast({
              title: "Failed to kick player",
              description: response.error || "Something went wrong",
              variant: "destructive",
            });
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  };
  
  // Leave room
  const handleLeaveRoom = () => {
    setPin(null);
    setRoom(null);
    setIsInGame(false);
  };
  
  // Toggle music
  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };
  
  const value: GameContextType = {
    pin,
    setPin,
    playerName,
    setPlayerName,
    avatar,
    setAvatar,
    room,
    isHost,
    isInGame,
    currentQuestion,
    setCurrentQuestion,
    musicEnabled,
    toggleMusic,
    fullscreenEnabled,
    toggleFullscreen,
    joinRoom,
    createRoom,
    startGame,
    submitAnswer,
    nextQuestion,
    kickPlayer,
    leaveRoom: handleLeaveRoom,
    isSocketConnected, 
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
