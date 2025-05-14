import { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Question, Option } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { MediaControls } from '../ui/MediaControls';

export const PlayingPhase = () => {
  const { 
    room, 
    quiz, 
    userProfile, 
    isPaused,
    pauseGame,
    nextQuestion,
    submitAnswer
  } = useGameContext();
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showingResults, setShowingResults] = useState(false);
  
  const isHost = userProfile?.role === 'host';
  const currentQuestionIndex = room?.currentQuestion ?? 0;
  const currentQuestion: Question | undefined = quiz?.questions[currentQuestionIndex];
  const totalTime = currentQuestion?.timeLimit ?? 20;

  // Reset the state when the question changes
  useEffect(() => {
    if (currentQuestion) {
      setSelectedOption(null);
      setTimeRemaining(currentQuestion.timeLimit);
      setShowingResults(false);
    }
  }, [currentQuestion]);

  // Timer effect
  useEffect(() => {
    if (!currentQuestion || isPaused || showingResults) return;

    // Set up the timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isPaused, showingResults]);

  // Handle when time is up
  const handleTimeUp = () => {
    setShowingResults(true);
    
    // Auto-advance to next question after 5 seconds
    setTimeout(() => {
      if (isHost) {
        handleNextQuestion();
      }
    }, 5000);
  };

  const handleSelectOption = (optionId: string) => {
    if (selectedOption || showingResults) return; // Prevent multiple answers
    
    setSelectedOption(optionId);
    
    // Find if the selected option is correct
    const isCorrect = currentQuestion?.options.find(o => o._id === optionId)?.isCorrect ?? false;
    
    // Submit the answer to the server
    submitAnswer(isCorrect);
  };

  const handleNextQuestion = () => {
    if (!isHost) return;
    nextQuestion();
  };

  const handleTogglePause = () => {
    if (!isHost) return;
    pauseGame();
  };

  // Render question media
  const renderQuestionMedia = () => {
    if (!currentQuestion) return null;
    
    const { media } = currentQuestion;
    
    switch (media.type) {
      case 'image':
        return media.url ? (
          <div className="w-full h-48 flex justify-center my-4">
            <img 
              src={media.url} 
              alt="Question media" 
              className="h-full object-contain"
            />
          </div>
        ) : null;
      
      case 'audio':
        return media.url ? (
          <div className="w-full flex justify-center my-4">
            <audio controls src={media.url} className="w-full max-w-md">
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : null;
      
      case 'video':
        return media.url ? (
          <div className="w-full h-48 flex justify-center my-4">
            <video 
              controls 
              src={media.url}
              className="h-full object-contain"
            >
              Your browser does not support the video element.
            </video>
          </div>
        ) : null;
        
      default:
        return null;
    }
  };

  if (!currentQuestion) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      <div className="w-full flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <span className="text-xl font-bold">
            Câu hỏi {currentQuestionIndex + 1}/{quiz?.questions.length || 0}
          </span>
          
          <span className="font-mono bg-primary/10 text-primary px-3 py-1 rounded-md">
            {timeRemaining}s
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <MediaControls />
          
          {isHost && (
            <>
              <Button 
                onClick={handleTogglePause}
                variant="outline"
              >
                {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
              </Button>
              
              <Button 
                onClick={handleNextQuestion}
              >
                Câu tiếp theo
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Progress 
        value={(timeRemaining / totalTime) * 100} 
        className="w-full h-2 mb-6" 
      />
      
      <Card className="w-full p-6 mb-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          {currentQuestion.questionText}
        </h2>
        
        {renderQuestionMedia()}
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {currentQuestion.options.map((option) => (
          <Button
            key={option._id}
            onClick={() => handleSelectOption(option._id)}
            className={`
              h-auto py-4 text-lg
              ${selectedOption === option._id ? 'ring-2 ring-primary' : ''}
              ${showingResults && option.isCorrect ? 'bg-green-600 hover:bg-green-700' : ''}
              ${showingResults && selectedOption === option._id && !option.isCorrect 
                ? 'bg-red-600 hover:bg-red-700' : ''}
            `}
            disabled={!!selectedOption || showingResults}
          >
            {option.text}
          </Button>
        ))}
      </div>
      
      {showingResults && (
        <div className="w-full mt-8">
          <h3 className="text-xl font-bold text-center">
            {selectedOption 
              ? (currentQuestion.options.find(o => o._id === selectedOption)?.isCorrect 
                ? '✅ Chính xác!' 
                : '❌ Không chính xác!')
              : '⏱️ Hết thời gian!'}
          </h3>
        </div>
      )}
    </div>
  );
};
