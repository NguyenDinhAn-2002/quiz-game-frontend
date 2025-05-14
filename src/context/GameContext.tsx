import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, Quiz, GamePhase, UserProfile } from '../types';
import * as socketService from '../socket';
import { getQuizById } from '../services/quiz';
import { useToast } from '@/hooks/use-toast';

interface GameContextProps {
  room: Room | null;
  quiz: Quiz | null;
  userProfile: UserProfile | null;
  gamePhase: GamePhase;
  isPaused: boolean;
  loading: boolean;
  error: string | null;
  createRoom: (quizId: string, asPlayer: boolean) => Promise<string>;
  joinRoom: (pin: string, name: string, avatar: string) => Promise<void>;
  startGame: () => void;
  pauseGame: () => void;
  nextQuestion: () => void;
  submitAnswer: (isCorrect: boolean) => void;
  kickPlayer: (socketId: string) => void;
  leaveRoom: () => void;
  setUserProfile: (profile: UserProfile) => void;
  setGamePhase: (phase: GamePhase) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const useGameContext = (): GameContextProps => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.LOBBY);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const socket = socketService.getSocket();

  // Initialize socket connection and set up listeners
  useEffect(() => {
    socketService.onRoomUpdated((updatedRoom) => {
      console.log('Room updated:', updatedRoom);
      setRoom(updatedRoom);
      
      // If the current question exceeds the total questions, go to results
      if (quiz && updatedRoom.currentQuestion >= quiz.questions.length) {
        setGamePhase(GamePhase.RESULTS);
      }
    });

    socketService.onGameStarted((updatedRoom) => {
      console.log('Game started:', updatedRoom);
      setRoom(updatedRoom);
      setGamePhase(GamePhase.PLAYING);
    });

    socketService.onNextQuestion((currentQuestion) => {
      console.log('Moving to question:', currentQuestion);
      setRoom((prev) => {
        if (!prev) return null;
        return { ...prev, currentQuestion };
      });
      
      if (quiz && currentQuestion >= quiz.questions.length) {
        setGamePhase(GamePhase.RESULTS);
      } else {
        setGamePhase(GamePhase.PLAYING);
      }
    });

    socketService.onGamePaused((paused) => {
      console.log('Game paused:', paused);
      setIsPaused(paused);
    });

    socketService.onKicked(() => {
      toast({
        title: "Bạn đã bị kick khỏi phòng",
        variant: "destructive",
      });
      resetGame();
    });

    // Save current socket ID
    if (userProfile && socket) {
      setUserProfile({
        ...userProfile,
        previousSocketId: socket.id
      });
    }

    return () => {
      socketService.removeListeners();
    };
  }, [quiz, socket.id]);

  // Load user profile and attempt reconnection on initial mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('quizUserProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        
        // If there's a saved room PIN, attempt to reconnect
        if (profile.pin) {
          console.log('Attempting to reconnect to room:', profile.pin);
          
          // Load the quiz data if we have a quizId
          if (profile.quizId) {
            loadQuizData(profile.quizId);
          }
          
          // Get the current socket ID
          const currentSocketId = socket.id;
          const previousSocketId = profile.previousSocketId;
          
          // Attempt to rejoin the room based on role
          if (profile.name && profile.avatar) {
            if (profile.role === 'host') {
              // Host reconnection
              socketService.reconnectAsHost({
                pin: profile.pin,
                hostId: profile.hostId || previousSocketId,
                quizId: profile.quizId
              }, (response) => {
                if (response && response.error) {
                  console.error('Failed to reconnect as host:', response.error);
                  toast({
                    title: "Không thể kết nối lại với phòng",
                    description: response.error,
                    variant: "destructive"
                  });
                  resetGame();
                } else {
                  // Successfully reconnected
                  toast({
                    title: "Đã kết nối lại với phòng",
                    variant: "default"
                  });
                  
                  // Update profile with new socket ID
                  setUserProfile({
                    ...profile,
                    previousSocketId: currentSocketId
                  });
                }
              });
            } else {
              // Player reconnection
              if (previousSocketId) {
                socketService.reconnectAsPlayer(
                  { 
                    pin: profile.pin, 
                    oldSocketId: previousSocketId,
                    name: profile.name, 
                    avatar: profile.avatar 
                  },
                  (response) => {
                    if (response && response.error) {
                      console.error('Failed to reconnect as player:', response.error);
                      toast({
                        title: "Không thể kết nối lại với phòng",
                        description: response.error,
                        variant: "destructive"
                      });
                      resetGame();
                    } else {
                      // Successfully reconnected
                      toast({
                        title: "Đã kết nối lại với phòng",
                        variant: "default"
                      });
                      
                      // Update profile with new socket ID
                      setUserProfile({
                        ...profile,
                        previousSocketId: currentSocketId
                      });
                    }
                  }
                );
              } else {
                // No previous socket ID, try joining as a new player
                socketService.joinRoomAsPlayer(
                  { pin: profile.pin, name: profile.name, avatar: profile.avatar },
                  (response) => {
                    if (response && response.error) {
                      console.error('Failed to rejoin room:', response.error);
                      toast({
                        title: "Không thể tham gia phòng",
                        description: response.error,
                        variant: "destructive"
                      });
                      resetGame();
                    } else {
                      toast({
                        title: "Đã kết nối lại với phòng",
                        variant: "default"
                      });
                      
                      // Update profile with new socket ID
                      setUserProfile({
                        ...profile,
                        previousSocketId: currentSocketId
                      });
                    }
                  }
                );
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to parse saved profile:', err);
        localStorage.removeItem('quizUserProfile');
      }
    }
  }, []);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('quizUserProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const loadQuizData = async (quizId: string) => {
    try {
      setLoading(true);
      const quizData = await getQuizById(quizId);
      setQuiz(quizData);
    } catch (err) {
      console.error('Failed to load quiz data:', err);
      setError('Failed to load quiz data');
      toast({
        title: "Không thể tải dữ liệu quiz",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (quizId: string, asPlayer: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      
      socketService.createRoomAsHost({ quizId, asPlayer }, (response) => {
        setLoading(false);
        
        if (response.error) {
          setError(response.error);
          toast({
            title: "Không thể tạo phòng",
            description: response.error,
            variant: "destructive"
          });
          reject(response.error);
          return;
        }
        
        const { pin, hostId } = response;
        const currentSocketId = socket.id;
        
        // Set user profile as host
        const hostProfile: UserProfile = {
          name: '',
          avatar: '',
          role: 'host',
          pin,
          hostId,
          asPlayer,
          quizId,
          previousSocketId: currentSocketId
        };
        
        setUserProfile(hostProfile);
        setGamePhase(GamePhase.LOBBY);
        
        // Load quiz data
        loadQuizData(quizId);
        
        resolve(pin);
      });
    });
  };

  const joinRoom = async (pin: string, name: string, avatar: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      
      socketService.joinRoomAsPlayer({ pin, name, avatar }, (response) => {
        setLoading(false);
        
        if (response.error) {
          setError(response.error);
          toast({
            title: "Không thể tham gia phòng",
            description: response.error,
            variant: "destructive"
          });
          reject(response.error);
          return;
        }
        
        const currentSocketId = socket.id;
        
        // Update user profile for player
        let updatedProfile = userProfile || { name: '', avatar: '', role: 'player', asPlayer: true };
        updatedProfile = {
          ...updatedProfile,
          name,
          avatar,
          pin,
          role: 'player',
          asPlayer: true,
          previousSocketId: currentSocketId
        };
        
        setUserProfile(updatedProfile);
        setGamePhase(GamePhase.LOBBY);
        
        resolve();
      });
    });
  };

  const startGame = () => {
    if (!room || !userProfile?.pin) return;
    
    socketService.startGameInRoom({ pin: userProfile.pin });
  };

  const pauseGame = () => {
    if (!room || !userProfile?.pin) return;
    
    const newPausedState = !isPaused;
    socketService.pauseGame({ pin: userProfile.pin, isPaused: newPausedState });
  };

  const nextQuestion = () => {
    if (!room || !userProfile?.pin) return;
    
    socketService.moveToNextQuestion({ pin: userProfile.pin });
  };

  const submitAnswer = (correct: boolean) => {
    if (!room || !userProfile?.pin) return;
    
    socketService.submitAnswerInRoom({ pin: userProfile.pin, correct });
  };

  const kickPlayer = (targetSocketId: string) => {
    if (!room || !userProfile?.pin) return;
    
    socketService.kickPlayerFromRoom({ 
      pin: userProfile.pin, 
      targetSocketId 
    }, (response) => {
      if (response.error) {
        toast({
          title: "Không thể kick người chơi",
          description: response.error,
          variant: "destructive"
        });
      }
    });
  };

  const leaveRoom = () => {
    if (!userProfile?.pin) return;
    
    socketService.leaveRoom(userProfile.pin);
    resetGame();
  };

  const resetGame = () => {
    setRoom(null);
    setQuiz(null);
    setUserProfile(null);
    setGamePhase(GamePhase.LOBBY);
    setIsPaused(false);
    localStorage.removeItem('quizUserProfile');
  };

  const value: GameContextProps = {
    room,
    quiz, 
    userProfile,
    gamePhase,
    isPaused,
    loading,
    error,
    createRoom,
    joinRoom,
    startGame,
    pauseGame,
    nextQuestion,
    submitAnswer,
    kickPlayer,
    leaveRoom,
    setUserProfile,
    setGamePhase
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
