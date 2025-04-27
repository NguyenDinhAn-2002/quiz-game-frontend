import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/QuestionCard';
import { PlayersList } from '@/components/PlayersList';
import { Leaderboard } from '@/components/Leaderboard';
import { GameControls } from '@/components/GameControls';
import { useGame } from '@/contexts/GameContext';
import { getQuizById } from '@/services/quiz';
import { Question } from '@/types';

const Game = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const {
    room,
    isHost,
    leaveRoom,
    submitAnswer,
    currentQuestion,
    setCurrentQuestion,
  } = useGame();

  const [gameStage, setGameStage] = useState<'pregame' | 'playing' | 'results'>('pregame');
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (room?.quizId) {
        try {
          const quizData = await getQuizById(room.quizId);
          setGameQuestions(quizData.questions || []);
        } catch (error) {
          console.error('Lỗi khi tải quiz:', error);
        }
      }
    };
    fetchData();
  }, [room]);

  useEffect(() => {
    if (!pin || !room) {
      navigate('/');
    }
  }, [pin, room, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStage('playing');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentQuestion >= gameQuestions.length && gameQuestions.length > 0) {
      setGameStage('results');
    }
  }, [currentQuestion, gameQuestions.length]);

  const handleAnswer = (isCorrect: boolean) => {
    submitAnswer(isCorrect);
  };

  const handleBackToLobby = () => {
    setCurrentQuestion(0);
    navigate(`/lobby/${pin}`);
  };

  const handleLeaveGame = () => {
    leaveRoom();
    navigate('/');
  };

  if (!room || !room.quizId) {
    return (
      <div className="game-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Đang tải trò chơi...</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  if (gameStage === 'pregame') {
    return (
      <div className="game-container flex items-center justify-center min-h-screen">
        <div className="text-center animate-pulse">
          <h1 className="text-5xl font-bold mb-6 text-game-primary">Chuẩn bị!</h1>
          <p className="text-2xl">Trò chơi sắp bắt đầu...</p>
        </div>
      </div>
    );
  }

  const currentQ = gameQuestions[currentQuestion];

  if (gameStage === 'results') {
    return (
      <div className="game-container min-h-screen p-4">
        <div className="max-w-4xl mx-auto py-8">
          <Card className="p-8 animate-bounce-in">
            <Leaderboard players={room.players} />
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button onClick={handleLeaveGame} variant="outline">
                Thoát về trang chủ
              </Button>
              {isHost && (
                <Button onClick={handleBackToLobby} className="bg-game-primary hover:bg-game-primary/90">
                  Quay lại phòng chờ
                </Button>
              )}
            </div>
          </Card>
        </div>
        <GameControls />
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="game-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy câu hỏi!</h1>
        </div>
      </div>
    );
  }

  const currentOpts = (currentQ.options || []).map(opt => ({
    ...opt,
    id: opt._id, // Thêm id để QuestionCard nhận diện được
  }));

  return (
    <div className="game-container min-h-screen p-4 bg-gradient-to-r from-purple-800 via-blue-900 to-black">
    <div className="max-w-6xl mx-auto py-4 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="order-2 md:order-1 md:col-span-1">
          <Card className="p-6 h-full bg-gradient-to-r from-indigo-900 via-purple-800 to-blue-700 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Người chơi</h2>
            <PlayersList players={room.players} />
          </Card>
        </div>
        <div className="order-1 md:order-2 md:col-span-3">
          <div className="text-center mb-4">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full px-6 py-2 shadow-lg">
              <span className="text-gray-200">Câu </span>
              <span className="font-bold text-white">{currentQuestion + 1}</span>
              <span className="text-gray-200"> / </span>
              <span className="font-bold text-white">{gameQuestions.length}</span>
            </div>
          </div>
          <QuestionCard question={currentQ} options={currentOpts} onAnswer={handleAnswer} />
        </div>
      </div>
    </div>
    <GameControls />
  </div>
  
  );
};

export default Game;
