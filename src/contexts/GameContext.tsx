import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  connectSocket, 
  onConnect, 
  onDisconnect, 
  onRoomUpdated, 
  onNewQuestion,
  onQuestionEnded,
  onScoreboard,
  onGameEnded,
  onPauseGame,
  onResumeGame,
  onPlayerKicked,
  onAnswerResult,
  onError,
  hostReconnect,
  joinRoom,
  cleanupRoomEvents
} from '../socket';

const GameContext = createContext({});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setRoom,
    setCurrentQuestion,
    setAnswerResult,
    setFinalLeaderboard,
    setScoreboard,
    setShowScoreboard,
    setIsConnected,
    setPhase,
    clearGameState,
    currentUser
  } = useGameStore();

  // Use ref to track if reconnection has been attempted
  const hasAttemptedReconnect = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('GameContext: Setting up socket connection and listeners');
    
    // Connect socket
    connectSocket();

    // Connection handlers
    const handleConnect = () => {
      console.log('GameContext: Socket connected');
      setIsConnected(true);
      
      // Only attempt reconnect once and with a delay to ensure socket is fully connected
      if (!hasAttemptedReconnect.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          attemptReconnect();
        }, 1000); // 1 second delay
      }
    };

    const attemptReconnect = () => {
      if (hasAttemptedReconnect.current) {
        console.log('GameContext: Reconnect already attempted, skipping');
        return;
      }

      hasAttemptedReconnect.current = true;

      // Get current room ID from URL
      const currentPath = window.location.pathname;
      const currentRoomId = currentPath.includes('/game/') 
        ? currentPath.split('/game/')[1] 
        : currentPath.includes('/play/')
        ? currentPath.split('/play/')[1]
        : null;

      // If we're on home page or creating a new room, clear old localStorage
      if (!currentRoomId || currentPath === '/') {
        console.log('GameContext: On home page or creating new room, clearing old localStorage');
        const storedRoomId = localStorage.getItem("roomId");
        if (storedRoomId) {
          localStorage.removeItem('roomId');
          localStorage.removeItem('playerId');
          localStorage.removeItem('role');
          localStorage.removeItem('asPlayer');
          localStorage.removeItem('name');
          localStorage.removeItem('avatar');
          console.log('GameContext: Cleared old localStorage data');
        }
        return;
      }

      // Auto-reconnect logic based on localStorage
      const storedRoomId = localStorage.getItem("roomId");
      const storedPlayerId = localStorage.getItem("playerId");
      const storedRole = localStorage.getItem("role");
      const storedAsPlayer = localStorage.getItem("asPlayer") === "true";
      const storedName = localStorage.getItem("name");
      const storedAvatar = localStorage.getItem("avatar");

      console.log('GameContext: Reconnect data:', { 
        storedRoomId, 
        currentRoomId, 
        storedRole, 
        storedAsPlayer 
      });

      // Check if stored room ID matches current room ID
      if (storedRoomId && currentRoomId && storedRoomId !== currentRoomId) {
        console.log('GameContext: Room ID mismatch, clearing localStorage');
        clearLocalStorageAndRedirect();
        return;
      }

      if (storedRoomId && storedRole && storedPlayerId && currentRoomId) {
        if (storedRole === "player" && storedAsPlayer) {
          console.log('GameContext: Reconnecting as player');
          joinRoom(storedRoomId, { 
            id: storedPlayerId, 
            name: storedName || "", 
            avatar: storedAvatar || "" 
          });
        } else if (storedRole === "host" && !storedAsPlayer) {
          console.log('GameContext: Reconnecting as host');
          hostReconnect(storedRoomId, storedPlayerId);
        } else if (storedRole === "host" && storedAsPlayer) {
          console.log('GameContext: Reconnecting as host playing');
          joinRoom(storedRoomId, { 
            id: storedPlayerId, 
            name: storedName || "", 
            avatar: storedAvatar || "" 
          });
        }
      } else {
        console.log('GameContext: No valid reconnect data found or room ID missing');
      }
    };

    const handleDisconnect = () => {
      console.log('GameContext: Socket disconnected');
      setIsConnected(false);
      // Reset reconnect flag when disconnected so it can try again on reconnect
      hasAttemptedReconnect.current = false;
    };

    const handleRoomUpdated = (roomData: any) => {
      console.log('GameContext: Room updated:', roomData);
      const room = {
        id: roomData.id,
        hostId: roomData.hostId,
        isStarted: roomData.isStarted,
        paused: roomData.paused,
        currentQuestionIndex: roomData.currentQuestionIndex,
        totalQuestions: roomData.quizData?.questions?.length || 0,
        questionTimeLimit: roomData.questionTimeLimit || 30,
        questionStartTime: roomData.questionStartTime || 0,
        players: roomData.players || [],
        quizData: roomData.quizData,
        host: roomData.host
      };
      
      // Set room first
      setRoom(room);
      
      // Then determine and force set the correct phase
      let newPhase: "lobby" | "playing" | "result" = "lobby";
      
      if (room.isStarted) {
        if (room.currentQuestionIndex >= room.totalQuestions) {
          newPhase = "result";
        } else {
          newPhase = "playing";
        }
      }
      
      console.log('GameContext: Setting phase to:', newPhase);
      setPhase(newPhase);
    };

    const handleNewQuestion = (data: any) => {
      console.log('GameContext: New question received:', data);
      setCurrentQuestion(data.question);
      setAnswerResult(null);
      // Force set to playing phase when new question arrives
      setPhase("playing");
      
      // Update room with new question data
      const currentRoom = useGameStore.getState().room;
      if (currentRoom) {
        setRoom({
          ...currentRoom,
          currentQuestionIndex: data.index,
          questionStartTime: data.questionStartTime,
          questionTimeLimit: data.timeLimit,
          paused: false // Ensure not paused when new question starts
        });
      }
    };

    const handleAnswerResult = (data: any) => {
      console.log('GameContext: Answer result:', data);
      setAnswerResult({
        result: data.result as "Đúng" | "Sai",
        score: data.score,
        correctAnswer: data.correctAnswer,
        playerAnswer: data.playerAnswer
      });
    };

    const handleQuestionEnded = (data: any) => {
      console.log('GameContext: Question ended:', data);
      // Question ended, still in playing phase until scoreboard or next question
    };

    const handleScoreboard = (data: any) => {
      console.log('GameContext: Scoreboard:', data);
      setScoreboard(data);
      setShowScoreboard(true);
      // Hide scoreboard after 5 seconds
      setTimeout(() => {
        setShowScoreboard(false);
        setScoreboard(null);
      }, 5000);
    };

    const handleGameEnded = (data: any) => {
      console.log('GameContext: Game ended:', data);
      setFinalLeaderboard(data.finalLeaderboard);
      // Force set to result phase when game ends
      setPhase("result");
    };

    const handlePauseGame = () => {
      console.log('GameContext: Game paused - updating room state');
      const currentRoom = useGameStore.getState().room;
      if (currentRoom) {
        setRoom({
          ...currentRoom,
          paused: true
        });
      }
    };

    const handleResumeGame = (data: any) => {
      console.log('GameContext: Game resumed with data:', data);
      const currentRoom = useGameStore.getState().room;
      if (currentRoom) {
        // Calculate new questionStartTime based on remaining time
        const newQuestionStartTime = Date.now() - ((currentRoom.questionTimeLimit - data.remainingTime) * 1000);
        setRoom({
          ...currentRoom,
          paused: false,
          questionStartTime: newQuestionStartTime
        });
      }
    };

    const handlePlayerKicked = (data: any) => {
      console.log('GameContext: Player kicked:', data);
      if (currentUser && data.playerId === currentUser.id) {
        alert("You have been kicked from the room");
        clearLocalStorageAndRedirect();
      }
    };

    const clearLocalStorageAndRedirect = () => {
      // Clear localStorage
      localStorage.removeItem('roomId');
      localStorage.removeItem('playerId');
      localStorage.removeItem('role');
      localStorage.removeItem('asPlayer');
      localStorage.removeItem('name');
      localStorage.removeItem('avatar');
      
      // Clear state
      clearGameState();
      
      // Reset reconnect flag
      hasAttemptedReconnect.current = false;
      
      // Redirect to home
      window.location.href = "/";
    };

    const handleError = (message: string) => {
      console.error('GameContext: Socket error:', message);
      
      // Handle specific room not found error
      if (message.includes('Room not found') || message.includes('not found')) {
        console.log('GameContext: Room not found, clearing localStorage and redirecting');
        clearLocalStorageAndRedirect();
        return;
      }
      
      // For other errors, show alert and redirect
      alert(message);
      clearLocalStorageAndRedirect();
    };

    // Set up event listeners
    onConnect(handleConnect);
    onDisconnect(handleDisconnect);
    onRoomUpdated(handleRoomUpdated);
    onNewQuestion(handleNewQuestion);
    onAnswerResult(handleAnswerResult);
    onQuestionEnded(handleQuestionEnded);
    onScoreboard(handleScoreboard);
    onGameEnded(handleGameEnded);
    onPauseGame(handlePauseGame);
    onResumeGame(handleResumeGame);
    onPlayerKicked(handlePlayerKicked);
    onError(handleError);

    // Cleanup function
    return () => {
      console.log('GameContext: Cleaning up socket listeners');
      
      // Clear timeout if it exists
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Reset reconnect flag
      hasAttemptedReconnect.current = false;
      
      cleanupRoomEvents();
    };
  }, []); // Empty dependency array to run only once

  return <GameContext.Provider value={{}}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  return useContext(GameContext);
};