import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  Play,
  Pause,
  SkipForward,
  UserX,
  UserPlus,
  LogOut,
  Maximize,
} from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { AvatarSelector } from "./AvatarSelector";
import { AudioManager } from "./AudioManager";
import { joinRoom } from "../socket";

export const LobbyPhase: React.FC = () => {
  const {
    room,
    currentUser,
    startGame,
    pauseGame,
    resumeGame,
    nextQuestion,
    kickPlayer,
    leaveRoom,
    setCurrentUser,
  } = useGameStore();

  const [showAvatarSelector, setShowAvatarSelector] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const navigate = useNavigate();

  if (!room || !currentUser) {
    return <div>Loading...</div>;
  }

  const isHost = currentUser.role === "host";
  const hostAsPlayer = isHost && currentUser.asPlayer;
  const canStartGame = room.players.length >= 1;

  const copyRoomPin = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
    } catch (err) {
      console.error("Failed to copy PIN:", err);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleJoinAsPlayer = (name: string, avatar: string) => {
    if (isHost && !hostAsPlayer) {
      const updatedUser = {
        ...currentUser,
        name,
        avatar,
        asPlayer: true,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("name", name);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("asPlayer", "true");
      joinRoom(room.id, {
        id: currentUser.id,
        name,
        avatar,
      });
    }
    setShowAvatarSelector(false);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">Mã phòng
            </h1>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-xl font-mono text-white bg-white/20 px-4 py-2 rounded-lg">
                {room.id}
              </span>
              <button
                onClick={copyRoomPin}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                title="Copy PIN"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-center md:justify-end mt-4 md:mt-0 gap-3">
            <AudioManager />
            <button
              onClick={toggleFullscreen}
              className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <Maximize size={20} />
            </button>
            <button
              onClick={handleLeaveRoom}
              className="flex items-center px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="ml-2">Rời phòng</span>
            </button>
          </div>
        </div>

        {/* Host Controls */}
        {isHost && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startGame}
                disabled={!canStartGame}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  canStartGame
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
              >
                <Play size={20} />
                <span>Bắt đầu</span>
              </button>

              {room.isStarted && (
                <>
                  {room.paused ? (
                    <button
                      onClick={resumeGame}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Play size={20} />
                      <span>Tiếp tục</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseGame}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                    >
                      <Pause size={20} />
                      <span>Tạm dừng</span>
                    </button>
                  )}

                  <button
                    onClick={nextQuestion}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <SkipForward size={20} />
                    <span>Câu hỏi kế tiếp</span>
                  </button>
                </>
              )}

              {!hostAsPlayer && (
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  <UserPlus size={20} />
                  <span>Tham gia</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Players Grid */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
           Người chơi ({room.players.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {room.players.map((player) => (
              <div
                key={player.id}
                className={`bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center shadow-md transition transform hover:scale-105 ${
                  player.isConnected
                    ? "border-2 border-green-400"
                    : "border-2 border-red-400"
                }`}
              >
                <div className="mb-2">
                  <img
                    src={player.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-white shadow"
                  />
                </div>
                <div className="font-semibold text-white mb-1 truncate">
                  {player.name}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    player.isConnected ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {player.isConnected ? "Online" : "Offline"}
                </div>

                {isHost && player.id !== currentUser.id && (
                  <button
                    onClick={() => kickPlayer(player.id)}
                    className="mt-2 flex items-center space-x-1 px-2 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded text-xs transition-colors mx-auto"
                  >
                    <UserX size={12} />
                    <span>Kick</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onDone={handleJoinAsPlayer}
        onCancel={() => setShowAvatarSelector(false)}
      />
    </div>
  );
};
