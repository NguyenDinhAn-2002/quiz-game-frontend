import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

export const MediaControls = () => {
  const [muted, setMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Effect to check if we're already in fullscreen on mount
  useEffect(() => {
    const updateFullscreenStatus = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', updateFullscreenStatus);
    updateFullscreenStatus();

    return () => document.removeEventListener('fullscreenchange', updateFullscreenStatus);
  }, []);

  // Toggle mute/unmute
  const toggleMute = () => {
    setMuted(!muted);
    // Here you would also mute/unmute any actual audio playing
    // Since this is a frontend-only demo, we'll just toggle the state
  };

  // Toggle fullscreen
  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMute}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFullScreen}
        title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </Button>
    </div>
  );
};