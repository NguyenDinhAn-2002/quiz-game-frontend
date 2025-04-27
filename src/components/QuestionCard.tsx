import React, { useState, useEffect } from 'react';
import { Question, Option } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface QuestionCardProps {
  question: Question;
  options: Option[]; // Những option có thể có _id
  onAnswer: (isCorrect: boolean) => void;
}

export const QuestionCard = ({ question, options, onAnswer }: QuestionCardProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(question.timeLimit || 10);
  const [answered, setAnswered] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // 🛠 Normalize options: đảm bảo mỗi option có "id"
  const normalizedOptions = options.map((opt) => ({
    ...opt,
    id: opt.id || opt._id,
  }));

  useEffect(() => {
    if (timeLeft <= 0 || answered) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, answered]);

  useEffect(() => {
    if (timeLeft <= 0 && !answered) {
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    setSelectedOptions([]);
    setTimeLeft(question.timeLimit || 10);
    setAnswered(false);
    setShowAnswer(false);
  }, [question.id]);

  const handleOptionClick = (optionId: string) => {
    if (answered) return;

    if (question.questionType === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmit = () => {
    setAnswered(true);
    const isCorrect = checkAnswer();
    onAnswer(isCorrect);
    setTimeout(() => setShowAnswer(true), 500);
  };

  const checkAnswer = (): boolean => {
    if (question.questionType === 'single') {
      const selectedOption = normalizedOptions.find((opt) => opt.id === selectedOptions[0]);
      return !!selectedOption?.isCorrect;
    } else {
      const correctOptions = normalizedOptions.filter((opt) => opt.isCorrect).map((o) => o.id);
      const allCorrectSelected = correctOptions.every((id) => selectedOptions.includes(id));
      const noIncorrect = selectedOptions.every((id) => correctOptions.includes(id));
      return allCorrectSelected && noIncorrect;
    }
  };

  const getOptionVariant = (option: Option & { id: string }) => {
    if (!showAnswer) {
      return selectedOptions.includes(option.id) ? 'selected' : 'default';
    }

    if (option.isCorrect) return 'correct';
    if (selectedOptions.includes(option.id)) return 'incorrect';
    return 'default';
  };

  const getOptionClass = (variant: string) => {
    switch (variant) {
      case 'selected':
        return 'bg-purple-600 text-white hover:bg-purple-700';
      case 'correct':
        return 'bg-green-600 text-white';
      case 'incorrect':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-800 text-white hover:bg-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-800 rounded-xl p-6 shadow-lg max-w-3xl w-full mx-auto animate-fade-in">
      {/* Timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-white">Thời gian còn lại</span>
          <span className="font-bold text-white">
            {isNaN(timeLeft) || timeLeft < 0 ? '0' : timeLeft}s
          </span>
        </div>
        <Progress
          value={question.timeLimit ? Math.max(0, (timeLeft / question.timeLimit) * 100) : 0}
          className="h-2 bg-blue-600"
        />
      </div>

      {/* Question text */}
      <div className="mb-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-3">{question.questionText}</h2>

        {/* Media rendering */}
        {question.media.type === 'image' && question.media.url && (
          <img
            src={question.media.url}
            alt="Question media"
            className="max-h-60 max-w-full mx-auto rounded-lg mb-4"
          />
        )}
        {question.media.type === 'audio' && question.media.url && (
          <div className="mb-4 flex justify-center">
            <audio controls src={question.media.url} className="w-full max-w-md" />
          </div>
        )}
        {question.media.type === 'video' && question.media.url && (
          <video
            controls
            src={question.media.url}
            className="max-h-60 max-w-full mx-auto rounded-lg mb-4"
          />
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {normalizedOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            disabled={answered}
            className={`option-button shadow-sm border ${getOptionClass(
              getOptionVariant(option)
            )} transition-all`}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Submit button */}
      {!answered && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="bg-game-primary hover:bg-game-primary/90 px-8 py-2 rounded-full font-bold text-lg text-white"
          >
            Gửi đáp án
          </Button>
        </div>
      )}

      {/* Feedback */}
      {showAnswer && (
        <div className="mt-4 text-center">
          {checkAnswer() ? (
            <div className="text-green-500 font-bold text-xl animate-bounce-in">
              Chính xác! 🎉
            </div>
          ) : (
            <div className="text-red-500 font-bold text-xl animate-bounce-in">
              Sai rồi 😢
            </div>
          )}
        </div>
      )}
    </div>
  );
};
