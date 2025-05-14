import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { parseAvatarString } from '../avatar/avatar';
import { MediaControls } from '../ui/MediaControls';
import { Player } from '@/types';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { getSocket } from '@/socket';
import { Wifi, WifiOff } from 'lucide-react';

export const ResultPhase = () => {
  const { 
    room, 
    quiz, 
    userProfile, 
    leaveRoom 
  } = useGameContext();
  
  const isHost = userProfile?.role === 'host';
  const socket = getSocket();
  
  // Sort players by score
  const sortedPlayers = [...(room?.players || [])].sort((a, b) => b.score - a.score);
  
  // Get top 3 players
  const topPlayers = sortedPlayers.slice(0, 3);
  const remainingPlayers = sortedPlayers.slice(3);

  // Find the current user in the sorted player list
  const currentPlayerRank = sortedPlayers.findIndex(
    p => p.socketId === socket?.id || (p.isHost && isHost)
  );

  // Effect to trigger confetti on component mount
  useEffect(() => {
    if (topPlayers.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Kết quả cuối cùng</h1>
      
      {/* Quiz info */}
      <div className="w-full mb-8 text-center">
        <h2 className="text-xl font-semibold">{quiz?.title}</h2>
        <p className="text-muted-foreground">{quiz?.questions.length} câu hỏi</p>
      </div>
      
      {/* Winner's podium */}
      {topPlayers.length > 0 && (
        <div className="w-full flex justify-center items-end mb-12">
          {topPlayers[1] && (
            <div className="flex flex-col items-center mx-4">
              <div className="text-2xl font-bold">🥈</div>
              <div className="relative">
                {!topPlayers[1].isConnected && (
                  <WifiOff className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
                )}
                <AvatarDisplay 
                  avatarParts={parseAvatarString(topPlayers[1].avatar)}
                  size="medium"
                  className={topPlayers[1].isConnected ? "" : "opacity-60"}
                />
              </div>
              <div className="mt-2 font-semibold">{topPlayers[1].name}</div>
              <div className="bg-secondary px-3 py-1 rounded-full mt-1">
                {topPlayers[1].score} điểm
              </div>
              <div className="h-20 w-16 bg-gray-300 mt-2"></div>
            </div>
          )}
          
          {topPlayers[0] && (
            <div className="flex flex-col items-center mx-4 -mt-8">
              <div className="text-3xl font-bold">🏆</div>
              <div className="relative">
                {!topPlayers[0].isConnected && (
                  <WifiOff className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
                )}
                <AvatarDisplay 
                  avatarParts={parseAvatarString(topPlayers[0].avatar)}
                  size="large"
                  className={topPlayers[0].isConnected ? "" : "opacity-60"}
                />
              </div>
              <div className="mt-2 font-bold text-xl">{topPlayers[0].name}</div>
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full mt-1">
                {topPlayers[0].score} điểm
              </div>
              <div className="h-28 w-20 bg-yellow-300 mt-2"></div>
            </div>
          )}
          
          {topPlayers[2] && (
            <div className="flex flex-col items-center mx-4">
              <div className="text-xl font-bold">🥉</div>
              <div className="relative">
                {!topPlayers[2].isConnected && (
                  <WifiOff className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
                )}
                <AvatarDisplay 
                  avatarParts={parseAvatarString(topPlayers[2].avatar)}
                  size="medium"
                  className={topPlayers[2].isConnected ? "" : "opacity-60"}
                />
              </div>
              <div className="mt-2 font-semibold">{topPlayers[2].name}</div>
              <div className="bg-secondary px-3 py-1 rounded-full mt-1">
                {topPlayers[2].score} điểm
              </div>
              <div className="h-16 w-16 bg-amber-700 mt-2"></div>
            </div>
          )}
        </div>
      )}
      
      {/* Remaining players list */}
      {remainingPlayers.length > 0 && (
        <div className="w-full mb-8">
          <h3 className="text-lg font-medium mb-4">Xếp hạng khác</h3>
          <div className="space-y-2">
            {remainingPlayers.map((player, index) => (
              <div 
                key={player.socketId}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${player.socketId === socket?.id || (player.isHost && isHost) 
                    ? 'bg-primary/10 ring-1 ring-primary' : 'bg-secondary'}
                  ${!player.isConnected ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-center">
                  <span className="w-8 text-center font-mono">{index + 4}</span>
                  <AvatarDisplay 
                    avatarParts={parseAvatarString(player.avatar)}
                    size="small"
                    className="ml-2"
                  />
                  <span className="ml-3 font-medium">{player.name}</span>
                  <div className="flex items-center ml-2">
                    {player.isHost && (
                      <span className="text-xs bg-primary/20 text-primary px-1 rounded mr-1">
                        Host
                      </span>
                    )}
                    {!player.isConnected && (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                <span className="font-mono">{player.score} điểm</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Your result if you're not in top players */}
      {currentPlayerRank >= 0 && currentPlayerRank >= 3 && (
        <div className="w-full mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Kết quả của bạn</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-8 text-center font-mono">{currentPlayerRank + 1}</span>
              <span className="ml-3 font-semibold">
                {sortedPlayers[currentPlayerRank].name}
              </span>
            </div>
            <span className="font-mono font-semibold">
              {sortedPlayers[currentPlayerRank].score} điểm
            </span>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="w-full flex justify-between items-center mt-4">
        <MediaControls />
        
        <div className="flex gap-3">
          {isHost ? (
            <>
              <Button variant="outline">
                Chơi lại
              </Button>
              <Button onClick={leaveRoom}>
                Kết thúc phiên
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline">
                Chia sẻ kết quả
              </Button>
              <Button onClick={leaveRoom}>
                Rời phòng
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
