import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '../store/gameStore';
import { fetchQuizDetail } from '../services/quiz';
import { connectSocket, createRoom, joinRoom } from '../socket';
import { AvatarSelector } from '../components/AvatarSelector';
import { LobbyPhase } from '../components/LobbyPhase';
import { PlayingPhase } from '../components/PlayingPhase';
import { ResultPhase } from '../components/ResultPhase';

export const GamePlay: React.FC = () => {
  const { quizId, pinId } = useParams();
  const navigate = useNavigate();
  const { 
    room, 
    currentUser, 
    phase, 
    setCurrentUser, 
    clearGameState 
  } = useGameStore();

  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    initializeGame();
  }, [quizId, pinId]);

  const initializeGame = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('GamePlay: Initializing game for quizId:', quizId, 'pinId:', pinId);
      
      // Read localStorage
      const storedRoomId = localStorage.getItem("roomId");
      const storedPlayerId = localStorage.getItem("playerId");
      const storedRole = localStorage.getItem("role");
      const storedAsPlayer = localStorage.getItem("asPlayer") === "true";
      const storedName = localStorage.getItem("name");
      const storedAvatar = localStorage.getItem("avatar");

      const currentRoomId = quizId || pinId;

      console.log('GamePlay: Stored data:', { storedRoomId, storedRole, storedAsPlayer, storedAvatar });

      // If localStorage doesn't match current room, clear it
      if (storedRoomId && storedRoomId !== currentRoomId) {
        console.log('GamePlay: Clearing localStorage - room mismatch');
        localStorage.clear();
      }

      if (quizId) {
        // Host flow - /game/:quizId
        await handleHostFlow(quizId, storedRoomId, storedPlayerId, storedRole, storedAsPlayer, storedName, storedAvatar);
      } else if (pinId) {
        // Player flow - /play/:pinId
        await handlePlayerFlow(pinId, storedRoomId, storedPlayerId, storedRole, storedAsPlayer, storedName, storedAvatar);
      } else {
        throw new Error('Invalid route parameters');
      }
    } catch (err) {
      console.error('GamePlay: Failed to initialize game:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
    } finally {
      setLoading(false);
    }
  };

  const handleHostFlow = async (
    quizId: string, 
    storedRoomId: string | null,
    storedPlayerId: string | null,
    storedRole: string | null,
    storedAsPlayer: boolean,
    storedName: string | null,
    storedAvatar: string | null
  ) => {
    if (!storedRoomId || storedRoomId !== quizId) {
      console.log('GamePlay: Creating new room');
      // First time creating room
      const quizData = await fetchQuizDetail(quizId);
      const hostId = uuidv4();
      
      // Set current user
      setCurrentUser({
        id: hostId,
        name: '',
        avatar: '',
        role: 'host',
        asPlayer: false
      });

      // Store in localStorage (will be updated when room is created)
      localStorage.setItem("playerId", hostId);
      localStorage.setItem("role", "host");
      localStorage.setItem("asPlayer", "false");

      // Create room - the backend will return roomId via room-updated event
      createRoom(hostId, quizData);
    } else if (storedRole === "host") {
      console.log('GamePlay: Host reconnecting');
      // Host reconnecting - ensure avatar is a string
      const avatarString = typeof storedAvatar === 'string' ? storedAvatar : '';
      setCurrentUser({
        id: storedPlayerId!,
        name: storedName || '',
        avatar: avatarString,
        role: 'host',
        asPlayer: storedAsPlayer
      });
      
      // Let the context handle reconnection via socket events
    }
  };

  const handlePlayerFlow = async (
    pinId: string,
    storedRoomId: string | null,
    storedPlayerId: string | null,
    storedRole: string | null,
    storedAsPlayer: boolean,
    storedName: string | null,
    storedAvatar: string | null
  ) => {
    if (!storedRoomId || storedRoomId !== pinId) {
      console.log('GamePlay: First time joining - showing avatar selector');
      // First time joining - show avatar selector
      setShowAvatarSelector(true);
    } else if (storedRole === "player" && storedAsPlayer) {
      console.log('GamePlay: Player reconnecting');
      // Player reconnecting - ensure avatar is a string
      const avatarString = typeof storedAvatar === 'string' ? storedAvatar : '';
      setCurrentUser({
        id: storedPlayerId!,
        name: storedName || '',
        avatar: avatarString,
        role: 'player',
        asPlayer: true
      });
      
      // Let the context handle reconnection via socket events
    }
  };

  const handleAvatarSelection = (name: string, avatar: string) => {
    const playerId = uuidv4();
    const roomId = pinId!;

    console.log('GamePlay: Avatar selected, joining room with:', { name, avatar: typeof avatar, avatarValue: avatar });

    // Ensure avatar is a string
    const avatarString = typeof avatar === 'string' ? avatar : '';

    // Set current user
    setCurrentUser({
      id: playerId,
      name,
      avatar: avatarString,
      role: 'player',
      asPlayer: true
    });

    // Store in localStorage
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("playerId", playerId);
    localStorage.setItem("role", "player");
    localStorage.setItem("asPlayer", "true");
    localStorage.setItem("name", name);
    localStorage.setItem("avatar", avatarString);

    // Close avatar selector
    setShowAvatarSelector(false);

    // Join room
    joinRoom(roomId, {
      id: playerId,
      name,
      avatar: avatarString
    });
  };

  const handleAvatarCancel = () => {
    setShowAvatarSelector(false);
    navigate('/');
  };

  // Handle navigation when room is created (for hosts)
  useEffect(() => {
    if (room && quizId && room.id !== quizId) {
      console.log('GamePlay: Room created, updating localStorage and navigating');
      // Room was created, update localStorage and navigate
      localStorage.setItem("roomId", room.id);
      navigate(`/game/${room.id}`, { replace: true });
    }
  }, [room, quizId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-300 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Show avatar selector for new players
  if (showAvatarSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700">
        <AvatarSelector
          isOpen={showAvatarSelector}
          onDone={handleAvatarSelection}
          onCancel={handleAvatarCancel}
        />
      </div>
    );
  }

  // Wait for room and user to be set
  if (!room || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Connecting...</div>
      </div>
    );
  }

  // Render appropriate phase based on current phase state
  console.log('GamePlay: Rendering phase:', phase, 'Room state:', { isStarted: room.isStarted, currentQuestionIndex: room.currentQuestionIndex, totalQuestions: room.totalQuestions });
  
  if (phase === 'result') {
    return <ResultPhase />;
  } else if (phase === 'playing') {
    return <PlayingPhase />;
  } else {
    return <LobbyPhase />;
  }
};
