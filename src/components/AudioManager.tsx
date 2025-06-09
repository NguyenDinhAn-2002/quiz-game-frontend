import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { useGameStore } from '../store/gameStore';
import { Slider } from './ui/slider';

// Audio file paths - replace these with your own audio files
const AUDIO_FILES = {
  backgroundMusic: '/src/assets/videoplayback.mp3',
  correctAnswer: '/audio/correct-answer.mp3',
  wrongAnswer: '/audio/wrong-answer.mp3',
  questionStart: '/audio/question-start.mp3',
  gameStart: '/audio/game-start.mp3',
  gameEnd: '/audio/game-end.mp3',
  tick: '/audio/tick.mp3',
  buttonClick: '/audio/button-click.mp3'
};

interface AudioManagerProps {
  className?: string;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ className }) => {
  const { phase, answerResult, room } = useGameStore();
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('audioMuted') === 'true';
  });
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('audioVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Background music
  const backgroundMusic = useAudio(AUDIO_FILES.backgroundMusic, {
    volume: isMuted ? 0 : volume * 0.3,
    loop: true,
    autoPlay: false
  });

  // Sound effects
  const correctSound = useAudio(AUDIO_FILES.correctAnswer, { volume: isMuted ? 0 : volume * 0.5 });
  const wrongSound = useAudio(AUDIO_FILES.wrongAnswer, { volume: isMuted ? 0 : volume * 0.5 });
  const questionStartSound = useAudio(AUDIO_FILES.questionStart, { volume: isMuted ? 0 : volume * 0.4 });
  const gameStartSound = useAudio(AUDIO_FILES.gameStart, { volume: isMuted ? 0 : volume * 0.6 });
  const gameEndSound = useAudio(AUDIO_FILES.gameEnd, { volume: isMuted ? 0 : volume * 0.6 });
  const tickSound = useAudio(AUDIO_FILES.tick, { volume: isMuted ? 0 : volume * 0.3 });

  // Handle phase changes
  useEffect(() => {
    if (isMuted) return;

    switch (phase) {
      case 'lobby':
        backgroundMusic.play();
        break;
      case 'playing':
        gameStartSound.play();
        setTimeout(() => {
          questionStartSound.play();
        }, 1000);
        break;
      case 'result':
        backgroundMusic.stop();
        gameEndSound.play();
        break;
    }
  }, [phase, isMuted]);

  // Handle answer results
  useEffect(() => {
    if (answerResult && !isMuted) {
      if (answerResult.result === "Đúng") {
        correctSound.play();
      } else {
        wrongSound.play();
      }
    }
  }, [answerResult, isMuted]);

  // Handle mute toggle
  useEffect(() => {
    localStorage.setItem('audioMuted', isMuted.toString());
    
    const currentVolume = isMuted ? 0 : volume * 0.3;
    backgroundMusic.setVolume(currentVolume);
    
    if (isMuted) {
      backgroundMusic.pause();
    } else if (phase === 'lobby' || phase === 'playing') {
      backgroundMusic.play();
    }
  }, [isMuted, phase]);

  // Handle volume changes
  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
    
    if (!isMuted) {
      backgroundMusic.setVolume(volume * 0.3);
      correctSound.setVolume(volume * 0.5);
      wrongSound.setVolume(volume * 0.5);
      questionStartSound.setVolume(volume * 0.4);
      gameStartSound.setVolume(volume * 0.6);
      gameEndSound.setVolume(volume * 0.6);
      tickSound.setVolume(volume * 0.3);
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      backgroundMusic.stop();
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  // Play tick sound for countdown (can be called from CountdownTimer)
  const playTick = () => {
    if (!isMuted) {
      tickSound.play();
    }
  };

  // Expose playTick to global scope for CountdownTimer to use
  useEffect(() => {
    (window as any).playTickSound = playTick;
    return () => {
      delete (window as any).playTickSound;
    };
  }, [isMuted, volume]);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleMute}
          className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {getVolumeIcon()}
          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          title="Volume Settings"
        >
          🎚️
        </button>
      </div>

      {showVolumeSlider && (
        <div className="absolute top-full mt-2 left-0 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-[200px] z-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Volume</span>
              <span className="text-sm text-gray-600">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
