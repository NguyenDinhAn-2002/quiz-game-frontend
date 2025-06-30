import { useState, useRef, useEffect } from 'react';

interface AudioOptions {
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export const useAudio = (src: string, options: AudioOptions = {}) => {
  const { volume = 1, loop = false, autoPlay = false } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;

    const audio = audioRef.current;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      if (autoPlay) {
        play();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [src, volume, loop, autoPlay]);

  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
    isLoaded
  };
};
