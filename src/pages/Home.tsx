import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Users, Clock, Tag, Plus, Sparkles, User, LogIn, LogOut } from 'lucide-react';
import { fetchQuizList } from '../services/quiz';
import { useAuth } from '../contexts/AuthContext';
import { QuizEditor } from '../components/QuizEditor';
import { CreateAIQuizModal } from '../components/CreateAIQuizModal';
import { Button } from '../components/ui/button';
import { QuizSummary } from '../types';

export const Home: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [showCreateAIQuiz, setShowCreateAIQuiz] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await fetchQuizList();
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayQuiz = (quizId: string) => {
    navigate(`/game/${quizId}`);
  };

  const handleJoinRoom = () => {
    if (pinInput.length === 6) {
      navigate(`/play/${pinInput}`);
    } else {
      setError('Please enter a valid 6-digit PIN');
    }
  };

  const handlePinInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      setPinInput(numericValue);
      setError('');
    }
  };

  const handleQuizCreated = () => {
    loadQuizzes(); // Refresh quiz list
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header with Auth */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">QuizMaster</h1>
              <p className="text-white/90">Real-time multiplayer quiz platform</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile">
                    <Button variant="outline" className="text-white border-white hover:bg-white/10">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={logout}
                    className="text-white border-white hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" className="text-white border-white hover:bg-white/10">
                      <LogIn className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-white text-purple-600 hover:bg-white/90">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12 pt-8">
        {/* Join Room Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Join a Room</h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={pinInput}
                onChange={(e) => handlePinInputChange(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className="w-full px-4 py-3 text-center text-2xl font-mono border-2 border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                maxLength={6}
              />
              {error && (
                <p className="text-red-300 text-sm mt-2 text-center">{error}</p>
              )}
            </div>
            
            <button
              onClick={handleJoinRoom}
              disabled={pinInput.length !== 6}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                pinInput.length === 6
                  ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Create Quiz Section */}
        {user && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Tạo Quiz Mới</h2>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Button
                onClick={() => setShowQuizEditor(true)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo thủ công
              </Button>
              <Button
                onClick={() => setShowCreateAIQuiz(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Tạo bằng AI
              </Button>
            </div>
          </div>
        )}

        {/* Available Quizzes */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            {user ? 'Tất cả Quiz' : 'Create a New Game'}
          </h2>
          
          {error && (
            <div className="bg-red-500/80 text-white p-4 rounded-lg mb-6 max-w-md mx-auto text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden">
                  {quiz.thumbnail ? (
                    <img
                      src={quiz.thumbnail}
                      alt={quiz.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-white text-6xl">🧠</div>
                    </div>
                  )}
                  
                  {/* Question Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{quiz.questionCount}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {quiz.title}
                  </h3>
                  
                  {quiz.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {quiz.description}
                    </p>
                  )}

                  {/* Tags */}
                  {quiz.tags && quiz.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {quiz.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          <Tag size={10} />
                          <span>{tag}</span>
                        </span>
                      ))}
                      {quiz.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{quiz.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>Multiplayer</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{quiz.questionCount} questions</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayQuiz(quiz._id)}
                    className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    <Play size={16} />
                    <span>Create Room</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {quizzes.length === 0 && !loading && (
            <div className="text-center text-white/80 py-12">
              <p className="text-xl">No quizzes available at the moment.</p>
              <button
                onClick={loadQuizzes}
                className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuizEditor
        isOpen={showQuizEditor}
        onClose={() => setShowQuizEditor(false)}
        onSuccess={handleQuizCreated}
      />
      <CreateAIQuizModal
        isOpen={showCreateAIQuiz}
        onClose={() => setShowCreateAIQuiz(false)}
        onSuccess={handleQuizCreated}
      />
    </div>
  );
};