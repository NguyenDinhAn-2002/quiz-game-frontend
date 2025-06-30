import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Pause, Play, SkipForward, Maximize } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { CountdownTimer } from './CountdownTimer';
import { Leaderboard } from './Leaderboard';
import { AudioManager } from './AudioManager';

export const PlayingPhase: React.FC = () => {
  const {
    room,
    currentUser,
    currentQuestion,
    answerResult,
    scoreboard,
    showScoreboard,
    submitAnswer,
    pauseGame,
    resumeGame,
    nextQuestion
  } = useGameStore();

  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [orderedOptions, setOrderedOptions] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowResults(false);
      setOrderedOptions(currentQuestion.options.map(opt => opt._id));
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (answerResult) {
      setShowResults(true);
      setTimeout(() => setShowResults(false), 3000);
    }
  }, [answerResult]);

  if (!room || !currentUser || !currentQuestion) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-white text-xl">Loading question...</div>
    </div>;
  }

  const isHost = currentUser.role === "host";
  const canAnswer = currentUser.asPlayer && !hasAnswered && !room.paused;

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSubmitAnswer = () => {
    if (canAnswer && selectedAnswer !== null) {
      let answerToSubmit = selectedAnswer;

      if (currentQuestion.questionType === 'order') {
        answerToSubmit = orderedOptions;
      }

      submitAnswer(answerToSubmit);
      setHasAnswered(true);
    }
  };

  const handleTimeout = () => {
    if (!hasAnswered && currentUser.asPlayer) {
      setHasAnswered(true);
    }
  };

  const handleSingleChoice = (optionId: string) => {
    if (canAnswer) {
      setSelectedAnswer(optionId);
    }
  };

  const handleMultipleChoice = (optionId: string) => {
    if (canAnswer) {
      const currentAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      if (currentAnswers.includes(optionId)) {
        setSelectedAnswer(currentAnswers.filter((id: string) => id !== optionId));
      } else {
        setSelectedAnswer([...currentAnswers, optionId]);
      }
    }
  };

  const handleOrderDragStart = (e: React.DragEvent, optionId: string) => {
    e.dataTransfer.setData('text/plain', optionId);
  };

  const handleOrderDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedIndex = orderedOptions.indexOf(draggedId);

    if (draggedIndex !== -1 && canAnswer) {
      const newOrder = [...orderedOptions];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedId);
      setOrderedOptions(newOrder);
      setSelectedAnswer(newOrder);
    }
  };

  const getCorrectAnswerText = () => {
    if (!answerResult || !currentQuestion) return '';

    switch (currentQuestion.questionType) {
      case 'single': {
        const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
        return correctOption ? correctOption.text : '';
      }

      case 'multiple': {
        const correctOptions = currentQuestion.options.filter(opt => opt.isCorrect);
        return correctOptions.map(opt => opt.text).join(', ');
      }

      case 'order': {
        return Array.isArray(answerResult.correctAnswer)
          ? answerResult.correctAnswer.map(id => {
              const option = currentQuestion.options.find(opt => opt._id === id);
              return option ? option.text : '';
            }).join(' → ')
          : '';
      }

      case 'input': {
        return Array.isArray(answerResult.correctAnswer)
          ? answerResult.correctAnswer.join(', ')
          : answerResult.correctAnswer;
      }

      default:
        return '';
    }
  };

  const renderAnswerOptions = () => {
    switch (currentQuestion.questionType) {
      case 'single':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option._id}
                onClick={() => handleSingleChoice(option._id)}
                disabled={!canAnswer}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                  selectedAnswer === option._id
                    ? 'bg-purple-500 text-white border-2 border-purple-300'
                    : 'bg-white hover:bg-purple-50 border-2 border-gray-200'
                } ${
                  !canAnswer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                } ${
                  showResults && answerResult
                    ? option.isCorrect
                      ? 'bg-green-500 text-white'
                      : selectedAnswer === option._id
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  {showResults && answerResult && option.isCorrect && (
                    <CheckCircle className="text-white" size={24} />
                  )}
                  {showResults && answerResult && !option.isCorrect && selectedAnswer === option._id && (
                    <XCircle className="text-white" size={24} />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = Array.isArray(selectedAnswer) && selectedAnswer.includes(option._id);
              return (
                <button
                  key={option._id}
                  onClick={() => handleMultipleChoice(option._id)}
                  disabled={!canAnswer}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-500 text-white border-2 border-purple-300'
                      : 'bg-white hover:bg-purple-50 border-2 border-gray-200'
                  } ${
                    !canAnswer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                  } ${
                    showResults && answerResult
                      ? option.isCorrect
                        ? 'bg-green-500 text-white'
                        : isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.text}</span>
                    {showResults && answerResult && option.isCorrect && (
                      <CheckCircle className="text-white" size={24} />
                    )}
                    {showResults && answerResult && !option.isCorrect && isSelected && (
                      <XCircle className="text-white" size={24} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'order':
        return (
          <div className="space-y-3">
            {orderedOptions.map((optionId, index) => {
              const option = currentQuestion.options.find(opt => opt._id === optionId);
              if (!option) return null;

              return (
                <div
                  key={option._id}
                  draggable={canAnswer}
                  onDragStart={(e) => handleOrderDragStart(e, option._id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleOrderDrop(e, index)}
                  className={`p-4 bg-white rounded-lg border-2 border-gray-200 transition-all duration-200 ${
                    canAnswer ? 'cursor-move hover:bg-purple-50 hover:scale-105' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium">{option.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'input':
        return (
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={selectedAnswer || ''}
              onChange={(e) => canAnswer && setSelectedAnswer(e.target.value)}
              disabled={!canAnswer}
              placeholder="Type your answer..."
              className={`w-full p-4 border-2 border-gray-200 rounded-lg text-center text-lg font-medium focus:outline-none focus:border-purple-500 ${
                !canAnswer ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
              }`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (showScoreboard && scoreboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 max-w-2xl w-full mx-4 animate-in fade-in duration-500">
          <Leaderboard 
            players={scoreboard.players.map(p => ({
              id: p.playerId,
              name: p.name,
              avatar: p.avatar || '👤',
              score: p.score,
              totalScore: p.totalScore
            }))}
            title="Bảng xếp hạng"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white text-lg">
                Câu hỏi {room.currentQuestionIndex + 1} trên {room.totalQuestions}
              </div>
              <CountdownTimer
                timeLimit={room.questionTimeLimit}
                questionStartTime={room.questionStartTime}
                onTimeout={handleTimeout}
                isPaused={room.paused}
              />
            </div>

            {room.paused && (
              <div className="bg-yellow-500/80 text-white px-4 py-2 rounded-lg mb-4">
                Tạm dừng
              </div>
            )}
          </div>
        </div>

        {isHost && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <AudioManager />
              <button
                onClick={toggleFullscreen}
                className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <Maximize size={20} />
              </button>
              {room.paused ? (
                <button
                  onClick={resumeGame}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
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
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {currentQuestion.questionText}
          </h2>

          {currentQuestion.media.url && (
            <div className="mb-6 text-center">
              {currentQuestion.media.type === 'image' && (
                <img
                  src={currentQuestion.media.url}
                  alt="Question media"
                  className="max-w-full h-auto mx-auto rounded-lg"
                />
              )}
              {currentQuestion.media.type === 'video' && (
                <video
                  src={currentQuestion.media.url}
                  controls
                  className="max-w-full h-auto mx-auto rounded-lg"
                />
              )}
              {currentQuestion.media.type === 'audio' && (
                <audio
                  src={currentQuestion.media.url}
                  controls
                  className="mx-auto"
                />
              )}
            </div>
          )}

          <div className="mb-6">{renderAnswerOptions()}</div>

          {currentUser.asPlayer && (
            <div className="text-center">
              {hasAnswered ? (
                <div className="text-gray-600 font-medium">
                  {showResults ? (
                    answerResult && (
                      <div className="space-y-3">
                        <div className={`text-xl font-bold ${
                          answerResult.result === "Đúng" ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {answerResult.result} - Bạn nhận được {answerResult.score} điểm!
                        </div>
                        {answerResult.result === "Sai" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                            <div className="text-green-800 font-semibold mb-2">
                              Câu trả lời đúng:
                            </div>
                            <div className="text-green-700 font-medium">
                              {getCorrectAnswerText()}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    "Chờ đợi kết quả..."
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={
                    !canAnswer ||
                    selectedAnswer === null ||
                    selectedAnswer === '' ||
                    (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
                  }
                  className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    canAnswer &&
                    selectedAnswer !== null &&
                    selectedAnswer !== '' &&
                    !(Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
                      ? 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Gửi câu trả lời
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
