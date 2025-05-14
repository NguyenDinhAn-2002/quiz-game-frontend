import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { GamePhase } from '@/types';
import { LobbyPhase } from '@/components/gameplay/LobbyPhase';
import { PlayingPhase } from '@/components/gameplay/PlayingPhase';
import { ResultPhase } from '@/components/gameplay/ResultPhase';
import { AvatarEditor } from '@/components/avatar/AvatarEditor';
import { getSocket } from '@/socket';

const GamePlay = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  
  const { 
    userProfile, 
    gamePhase,
    room,
    quiz,
    loading,
    error,
    joinRoom
  } = useGameContext();
  
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  
  // Check if we need to show avatar editor for a player (not for host initially)
  useEffect(() => {
    if (pin && userProfile && userProfile.role === 'player' && !userProfile.name) {
      setShowAvatarEditor(true);
    }
  }, [pin, userProfile]);
  
  // Redirect if no room pin
  useEffect(() => {
    if (!pin) {
      navigate('/');
    }
  }, [pin, navigate]);
  
  // Detect current socket connection
  useEffect(() => {
    const socket = getSocket();
    console.log('Current socket connection:', socket.id);
    
    // If we have user profile but no room data, we may need to reconnect
    if (userProfile?.pin && !room && pin === userProfile.pin) {
      console.log('Connected to socket but no room data yet. Waiting for reconnection to complete...');
    }
  }, [userProfile, room, pin]);
  
  // Handle avatar save
  const handleSaveAvatar = (name: string, avatar: string) => {
    if (!pin) return;
    
    joinRoom(pin, name, avatar)
      .then(() => {
        setShowAvatarEditor(false);
      })
      .catch((err) => {
        console.error('Error joining room:', err);
      });
  };
  
  // Render different components based on game phase
  const renderGamePhase = () => {
    switch (gamePhase) {
      case GamePhase.LOBBY:
        return <LobbyPhase />;
      case GamePhase.PLAYING:
        return <PlayingPhase />;
      case GamePhase.RESULTS:
        return <ResultPhase />;
      default:
        return <div>Unknown game phase</div>;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button 
            className="bg-primary text-white px-6 py-2 rounded-md"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Game content */}
      {renderGamePhase()}
      
      {/* Avatar editor for players */}
      {showAvatarEditor && (
        <AvatarEditor 
          open={showAvatarEditor}
          onClose={() => navigate('/')}
          onSave={handleSaveAvatar}
        />
      )}
    </div>
  );
};

export default GamePlay;
