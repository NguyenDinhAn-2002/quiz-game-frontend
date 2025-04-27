import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Quiz } from '@/types';

interface QuizCardProps {
  quiz: Quiz;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
  const navigate = useNavigate();
  const { playerName, avatar, createRoom, isSocketConnected } = useGame();

  const waitForSocketConnection = () => {
    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now();
      const timeout = 5000; // 5 giây timeout

      const interval = setInterval(() => {
        if (isSocketConnected) {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(new Error('Socket connection timeout'));
        }
      }, 100);
    });
  };

  const handleHostGame = async () => {
    console.log("Player Name:", playerName);
    console.log("Avatar:", avatar);

    if (!playerName) {
      console.log("Player name not found, navigating to /host/");
      navigate(`/host/${quiz._id}`);
      return;
    }

    try {
      console.log("Waiting for socket connection...");
      await waitForSocketConnection(); // 🛠️ Đợi socket kết nối trước

      console.log("Socket connected. Creating room...");
      const pin = await createRoom(quiz._id, playerName, avatar, true);

      if (pin) {
        console.log("Navigating to lobby with PIN:", pin);
        navigate(`/lobby/${pin}`);
      } else {
        console.error("Failed to create room: no PIN returned");
        alert('Failed to create room. Please try again.');
      }
      
    } catch (error) {
      console.error("Error while hosting game:", error);
      alert('Failed to connect to the server. Please try again.');
    }
  };

  return (
    <div className="quiz-card overflow-hidden rounded-lg shadow-lg border border-transparent transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={quiz.thumbnail || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop'} 
          alt={quiz.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-indigo-800/80 to-transparent">
          <h3 className="text-white font-semibold text-lg">{quiz.title}</h3>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {quiz.description || "No description available for this quiz."}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Created: {new Date(quiz.created_at || Date.now()).toLocaleDateString()}
          </span>
          <Button 
            onClick={handleHostGame}
            variant="default" 
            size="sm"
            className="bg-purple-700 hover:bg-purple-600 text-white transition-all duration-200 ease-in-out"
          >
            Play
          </Button>
        </div>
      </div>
    </div>
  );
};
