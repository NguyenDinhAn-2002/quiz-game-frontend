import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameControls } from '@/components/GameControls';
import { PlayersList } from '@/components/PlayersList';
import { AvatarDisplay } from '@/components/AvatarCustomizer';
import { useGame } from '@/contexts/GameContext';

const Lobby = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { room, isHost, leaveRoom, playerName, startGame, isInGame } = useGame();
  
  useEffect(() => {
    if (isInGame && room) {
      navigate(`/game/${pin}`);
    }
  }, [isInGame, room, pin, navigate]);
  
  const handleLeaveGame = () => {
    leaveRoom();
    navigate('/');
  };
  
  const handleStartGame = () => {
    if (isHost) {
      startGame();
    }
  };
  
  // Ensure users cannot access lobby without a valid PIN and room data
  useEffect(() => {
    if (!pin || !room) {
      navigate('/');
    }
  }, [pin, room, navigate]);
  
  if (!room) {
    return (
      <div className="game-container flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-800 to-blue-900">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4 animate-pulse">Loading...</h1>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white text-black"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-container min-h-screen p-6 bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-gray-800 rounded-xl shadow-lg animate-bounce-in">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-center text-white">
              <CardTitle className="text-2xl mb-2 sm:mb-0">Game Lobby</CardTitle>
              
              <div className="flex items-center gap-3">
                <div className="font-mono bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded-full text-xl">
                  PIN: {pin}
                </div>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(pin || '');
                  }}
                  className="text-black border-white"
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="text-white">
            <div className="p-6 bg-gray-700 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-game-primary flex items-center justify-center bg-white shadow-lg">
                      <AvatarDisplay avatar={room.players.find(p => p.name === playerName)?.avatar || ''} size="lg" />
                    </div>
                    
                    {isHost && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        H
                      </div>
                    )}
                  </div>
                  <div className="mt-2 font-bold">{playerName}</div>
                </div>
                
                <div className="border-b sm:border-b-0 sm:border-l border-gray-500 h-16 hidden sm:block"></div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Players in Lobby: {room.players.length}</h3>
                  
                  <div>
                    <div className="sound-wave h-6 flex items-center">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {isHost 
                        ? "Waiting for players to join... Press START when ready!" 
                        : "Waiting for the host to start the game..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Players</h2>
              <PlayersList players={room.players} showKickButton={isHost} />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button 
                onClick={handleLeaveGame}
                variant="outline" 
                className="bg-white text-black hover:bg-gray-400"
              >
                Leave Game
              </Button>
              
              {isHost && (
                <Button 
                  onClick={handleStartGame}
                  className="bg-game-primary hover:bg-game-primary/90 text-white px-8"
                  disabled={room.players.length === 0}
                >
                  Start Game
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <GameControls />
    </div>
  );
};

export default Lobby;
