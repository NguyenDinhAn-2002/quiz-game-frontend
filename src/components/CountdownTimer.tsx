import { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  timeLimit: number;
  questionStartTime: number;
  onTimeout: () => void;
  isPaused?: boolean;
  resumeTime?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeLimit,
  questionStartTime,
  onTimeout,
  isPaused = false,
  resumeTime
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedTimeRef = useRef<number | null>(null);

  // Reset when new question starts
  useEffect(() => {
    console.log('CountdownTimer: New question started, resetting timer');
    setTimeLeft(timeLimit);
    setHasTimedOut(false);
    pausedTimeRef.current = null;
  }, [questionStartTime, timeLimit]);

  // Handle pause/resume
  useEffect(() => {
    if (isPaused) {
      console.log('CountdownTimer: Game paused, stopping timer');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Store the current time when paused
      pausedTimeRef.current = timeLeft;
    } else if (!isPaused && pausedTimeRef.current !== null) {
      console.log('CountdownTimer: Game resumed, continuing from', pausedTimeRef.current);
      // Resume from where we left off
      setTimeLeft(pausedTimeRef.current);
      pausedTimeRef.current = null;
    }
  }, [isPaused, timeLeft]);

  // Main timer effect
  useEffect(() => {
    if (isPaused || hasTimedOut) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const elapsed = (now - questionStartTime) / 1000;
      return Math.max(0, timeLimit - elapsed);
    };

    // If we have resumeTime, use it, otherwise calculate from start
    const initialTime = resumeTime !== undefined ? resumeTime : calculateTimeLeft();
    console.log('CountdownTimer: Setting initial time to', initialTime);
    setTimeLeft(initialTime);

    if (initialTime <= 0) {
      console.log('CountdownTimer: Time already up');
      setHasTimedOut(true);
      onTimeout();
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start countdown
    intervalRef.current = setInterval(() => {
      const remaining = calculateTimeLeft();
      console.log('CountdownTimer: Time remaining:', remaining);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        console.log('CountdownTimer: Time up!');
        setHasTimedOut(true);
        onTimeout();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeLimit, questionStartTime, onTimeout, isPaused, resumeTime, hasTimedOut]);

  const progress = (timeLeft / timeLimit) * 100;
  const isLowTime = timeLeft <= 5;

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={isLowTime ? "#ef4444" : "#8b5cf6"}
            strokeWidth="3"
            strokeDasharray={`${progress}, 100`}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${isLowTime ? 'text-red-500' : 'text-purple-600'}`}>
            {Math.ceil(timeLeft)}
          </span>
        </div>
      </div>
      
      <div className="text-center">
        <div className={`text-2xl font-bold ${isLowTime ? 'text-red-500' : 'text-gray-800'}`}>
          {Math.ceil(timeLeft)}s
        </div>
        <div className="text-sm text-gray-500">
          {isPaused ? 'Paused' : 'remaining'}
        </div>
      </div>
    </div>
  );
};
