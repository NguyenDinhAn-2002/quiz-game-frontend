import React from 'react';
import { RotateCcw, LogOut, Share2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Leaderboard } from './Leaderboard';
import { AudioManager } from './AudioManager';
export const ResultPhase: React.FC = () => {
  const {
    room,
    currentUser,
    finalLeaderboard,
    leaveRoom
  } = useGameStore();

  if (!room || !currentUser) {
    return <div>Loading...</div>;
  }

  const isHost = currentUser.role === "host";

  const handlePlayAgain = () => {
    // Redirect to create a new room with the same quiz
    if (room.quizData) {
      window.location.href = `/game/${room.quizData._id}`;
    }
  };

  const handleShareResults = async () => {
    const shareText = `I just completed "${room.quizData?.title}" quiz! Check out my results!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quiz Results',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy results:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">🎉 Game Complete! 🎉</h1>
            <p className="text-xl text-white/90">
              {room.quizData?.title || 'Quiz'} - Final Results
            </p>
                 </div>
          
          {/* Audio Controls */}
          <div className="flex justify-center mb-6">
            <AudioManager />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 mb-8">
          <Leaderboard 
            players={finalLeaderboard}
            title="Final Leaderboard"
            showPodium={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {isHost ? (
            <>
              <button
                onClick={handlePlayAgain}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                <RotateCcw size={20} />
                <span>Play Again</span>
              </button>
              
              <button
                onClick={leaveRoom}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                <LogOut size={20} />
                <span>End Game</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleShareResults}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                <Share2 size={20} />
                <span>Share Results</span>
              </button>
              
              <button
                onClick={leaveRoom}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                <LogOut size={20} />
                <span>Leave Room</span>
              </button>
            </>
          )}
        </div>

        {/* Quiz Info */}
        {room.quizData && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8">
            <div className="text-center text-white">
              <p className="text-lg mb-2">Thanks for playing!</p>
              <p className="text-sm opacity-80">
                Quiz: {room.quizData.title} • {room.totalQuestions} Questions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};