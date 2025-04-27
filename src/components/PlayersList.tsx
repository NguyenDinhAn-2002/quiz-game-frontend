import React from 'react';
import { Player } from '@/types';
import { AvatarDisplay } from './AvatarCustomizer';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';

interface PlayersListProps {
  players: Player[];
  showKickButton?: boolean;
}

export const PlayersList = ({ players, showKickButton = false }: PlayersListProps) => {
  const { kickPlayer, isHost } = useGame();

  const handleKickPlayer = async (socketId: string) => {
    if (isHost && showKickButton) {
      await kickPlayer(socketId);
    }
  };

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No players have joined yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {players.map((player) => (
        <div 
          key={player.socketId}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg p-3 shadow-lg flex items-center justify-between animate-slide-in"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
                <AvatarDisplay avatar={player.avatar} size="md" />
              </div>
              {player.isHost && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  H
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium">{player.name}</h3>
              <p className="text-xs text-gray-300">Score: {player.score}</p>
            </div>
          </div>
          
          {showKickButton && isHost && !player.isHost && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleKickPlayer(player.socketId)}
            >
              Kick
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
