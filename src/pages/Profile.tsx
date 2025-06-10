import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { quizManagementService } from '../services/quizManagement';
import { QuizDetail } from '../types';
import { User, LogOut, Plus, Play, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [userQuizzes, setUserQuizzes] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserQuizzes();
  }, []);

  const loadUserQuizzes = async () => {
    try {
      setLoading(true);
      const quizzes = await quizManagementService.getUserQuizzes();
      setUserQuizzes(quizzes);
    } catch (error) {
      console.error('Error loading user quizzes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách quiz của bạn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quiz này?')) {
      try {
        await quizManagementService.deleteQuiz(quizId);
        setUserQuizzes(prev => prev.filter(quiz => quiz._id !== quizId));
        toast({
          title: "Thành công",
          description: "Đã xóa quiz thành công",
        });
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa quiz",
          variant: "destructive",
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem profile</p>
            <Link to="/login">
              <Button>Đăng nhập</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-white hover:text-white/80 transition-colors">
              ← Quay về trang chủ
            </Link>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <Button variant="outline" onClick={logout} className="text-red-600 border-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Thông tin cá nhân</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tên</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Loại tài khoản</label>
                <p className="text-lg capitalize">{user.provider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Vai trò</label>
                <p className="text-lg capitalize">{user.role || 'user'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Quizzes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Quiz của tôi ({userQuizzes.length})</span>
              </CardTitle>
              <Link to="/">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo quiz mới
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Đang tải quiz...</p>
              </div>
            ) : userQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Bạn chưa tạo quiz nào</p>
                <Link to="/">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo quiz đầu tiên
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userQuizzes.map((quiz) => (
                  <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{quiz.title}</h3>
                      
                      {quiz.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quiz.description}</p>
                      )}

                      {/* Tags */}
                      {quiz.tags && quiz.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {quiz.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                              <Tag size={10} />
                              <span>{typeof tag === 'string' ? tag : (tag as any).name || ''}</span>
                            </span>
                          ))}
                          {quiz.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{quiz.tags.length - 2}</span>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{quiz.questions?.length || 0} câu hỏi</span>
                        </div>
                        {quiz.createdAt && (
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{new Date(quiz.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link to={`/game/${quiz._id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            <Play size={14} className="mr-1" />
                            Chơi
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
