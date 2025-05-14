import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { AvatarEditor } from '../avatar/AvatarEditor';
import { parseAvatarString } from '../avatar/avatar';
import { MediaControls } from '../ui/MediaControls';
import { Card, CardContent } from '@/components/ui/card';
import { getSocket, joinRoomAsPlayer } from '@/socket';
import { Wifi, WifiOff } from 'lucide-react';

export const LobbyPhase = () => {
  const { 
    room, 
    quiz, 
    userProfile, 
    startGame, 
    kickPlayer,
    setUserProfile 
  } = useGameContext();
  
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);

  const isHost = userProfile?.role === 'host';
  const isHostJoinedAsPlayer = isHost && userProfile?.asPlayer;
  const pin = userProfile?.pin || '';
  
  const socket = getSocket();
  
  // Find the current user in the players list if they are a player
  const currentPlayer = room?.players.find(p => 
    p.socketId === socket?.id || (isHostJoinedAsPlayer && p.isHost)
  );

  // Check if the host has joined as a player
  const hostHasJoined = room?.players.some(p => p.isHost);

  const handleJoinAsHost = () => {
    setShowAvatarEditor(true);
  };

  const handleSaveAvatar = (name: string, avatar: string) => {
    if (!userProfile) return;
    
    // Update user profile with name and avatar
    const updatedProfile = {
      ...userProfile,
      name,
      avatar,
      asPlayer: true
    };
    
    // Save to context
    setUserProfile(updatedProfile);
    
    // Join the room as a player
    if (pin) {
      joinRoomAsPlayer({ 
        pin, 
        name, 
        avatar 
      }, (response) => {
        if (response.error) {
          console.error('Error joining room as host:', response.error);
        }
      });
    }
  };

  const handleKickPlayer = (socketId: string) => {
    if (confirm('Bạn có chắc muốn kick người chơi này?')) {
      kickPlayer(socketId);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="text-3xl font-bold">Phòng chờ</div>
        <div className="text-2xl font-mono bg-primary text-primary-foreground px-4 py-2 rounded-lg">
          PIN: {pin}
        </div>
      </div>

      {quiz && (
        <div className="w-full mb-8">
          <h2 className="text-xl font-semibold mb-2">Đang chơi:</h2>
          <Card className="overflow-hidden">
            <div 
              className="h-40 bg-cover bg-center"
              style={{
                backgroundImage: quiz.thumbnail 
                  ? `url(${quiz.thumbnail})` 
                  : 'linear-gradient(to right, #4f46e5, #8b5cf6)'
              }}
            />
            <CardContent className="p-4">
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{quiz.questions.length} câu hỏi</span>
                {quiz.tag && <span>• {quiz.tag.name}</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Người chơi ({room?.players.length || 0})</h2>
          {isHost && !isHostJoinedAsPlayer && (
            <Button onClick={handleJoinAsHost}>
              Join on this device
            </Button>
          )}
        </div>

        {room?.players && room.players.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {room.players.map((player) => (
              <div 
                key={player.socketId} 
                className={`flex flex-col items-center rounded-lg p-3 relative ${
                  player.isConnected ? "bg-secondary" : "bg-secondary/40"
                }`}
              >
                <div className="absolute top-1 right-1 flex gap-1">
                  {player.isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  {player.isHost && (
                    <span className="text-xs bg-primary text-primary-foreground px-1 rounded">
                      Host
                    </span>
                  )}
                </div>
                
                <AvatarDisplay 
                  avatarParts={parseAvatarString(player.avatar)}
                  size="medium"
                  className={player.isConnected ? "" : "opacity-60"}
                />
                <span className="mt-2 font-medium truncate w-full text-center">
                  {player.name}
                </span>
                
                {isHost && !player.isHost && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleKickPlayer(player.socketId)}
                    className="mt-2 w-full text-xs py-0"
                  >
                    Kick
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có người chơi nào tham gia
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-center">
        <MediaControls />
        
        {isHost && (
          <Button 
            onClick={startGame}
            size="lg" 
            className="bg-green-600 hover:bg-green-700"
            disabled={!room?.players.length}
          >
            Bắt đầu
          </Button>
        )}
      </div>

      {showAvatarEditor && (
        <AvatarEditor
          open={showAvatarEditor}
          onClose={() => setShowAvatarEditor(false)}
          onSave={handleSaveAvatar}
          defaultName={userProfile?.name}
          defaultAvatar={userProfile?.avatar}
        />
      )}
    </div>
  );
};
