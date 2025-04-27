import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export const GameControls = () => {
  const { musicEnabled, toggleMusic, fullscreenEnabled, toggleFullscreen, isHost, room, isInGame, nextQuestion } = useGame();

  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 items-end z-30">
      <div className={`bg-gradient-to-r from-purple-600 to-blue-500 p-4 rounded-lg shadow-lg mb-2 transition-all duration-300 ${showInstructions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <h3 className="font-bold text-white mb-2">Game Controls</h3>
        <ul className="text-sm text-gray-100 space-y-1">
          <li>• Turn music on/off</li>
          <li>• Toggle fullscreen mode</li>
          {isHost && !isInGame && room && (
            <li>• Start the game when ready</li>
          )}
          {isHost && isInGame && (
            <li>• Navigate through questions</li>
          )}
        </ul>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white bg-opacity-40 hover:bg-opacity-60 shadow-md text-white"
          onClick={() => setShowInstructions(!showInstructions)}
          aria-label="Toggle instructions"
        >
          ?
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white bg-opacity-40 hover:bg-opacity-60 shadow-md text-white"
          onClick={toggleMusic}
          aria-label={musicEnabled ? "Mute" : "Unmute"}
        >
          {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white bg-opacity-40 hover:bg-opacity-60 shadow-md text-white"
          onClick={toggleFullscreen}
          aria-label={fullscreenEnabled ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {fullscreenEnabled ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
        
        {isHost && isInGame && (
          <Button 
            variant="default" 
            className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:bg-opacity-80 shadow-md text-white"
            onClick={nextQuestion}
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};
