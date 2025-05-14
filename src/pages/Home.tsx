import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '@/services/quiz';
import { Quiz } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGameContext } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import { Play } from 'lucide-react';

const Home = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const { createRoom, joinRoom } = useGameContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    loadQuizzes();
  }, []);
  
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await fetchQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast({
        title: 'Error loading quizzes',
        description: 'Could not load quiz data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateRoom = async (quizId: string) => {
    try {
      const pin = await createRoom(quizId, false);
      navigate(`/play/${pin}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error creating room',
        description: 'Could not create a room. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
 const handleJoinRoom = async () => {
  if (!pinInput || pinInput.length < 6) {
    toast({
      title: 'Invalid PIN',
      description: 'Please enter a valid PIN to join a room',
      variant: 'destructive',
    });
    return;
  }


  const name = prompt("Nhập tên của bạn:");
  const avatar = "none:none:happy:blue"; 

  if (!name || name.trim() === '') {
    toast({
      title: 'Tên không hợp lệ',
      description: 'Vui lòng nhập tên để tham gia',
      variant: 'destructive',
    });
    return;
  }

  try {
    await joinRoom(pinInput, name, avatar); // Gọi hàm bạn đã viết
    navigate(`/play/${pinInput}`); // Điều hướng sau khi tham gia thành công
  } catch (error) {
    console.error('Join room error:', error);
    // Không điều hướng nếu thất bại
  }
};

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-fade-in">Quiz Group</h1>
          <p className="text-xl text-muted-foreground animate-fade-in">Chơi quiz cùng bạn bè của bạn!</p>
        </header>
        
        <div className="bg-card rounded-xl shadow-lg p-6 mb-12 border border-accent/20 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Tham gia phòng</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <Input 
              placeholder="Nhập mã PIN..." 
              className="text-lg p-6 focus:ring-2 focus:ring-primary/50" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleJoinRoom();
              }}
            />
            <Button 
              size="lg" 
              className="md:w-auto whitespace-nowrap transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:scale-105"
              onClick={handleJoinRoom}
            >
              Tham gia
            </Button>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left animate-fade-in">Chọn quiz để tạo phòng</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-muted h-64 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card 
                key={quiz._id} 
                className="overflow-hidden group hover:shadow-lg transition-all duration-300 border border-muted/50 hover:border-primary/30 hover:translate-y-[-4px] animate-fade-in"
              >
                <div 
                  className="h-40 bg-cover bg-center relative group"
                  style={{
                    backgroundImage: quiz.thumbnail 
                      ? `url(${quiz.thumbnail})` 
                      : 'linear-gradient(to right, #4f46e5, #8b5cf6)'
                  }}
                >
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      onClick={() => handleCreateRoom(quiz._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/90 hover:bg-primary hover:scale-110 transition-transform"
                      size="lg"
                    >
                      <Play className="mr-2" size={18} />
                      Play
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold line-clamp-1 mb-2">{quiz.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {quiz.questions.length} câu hỏi
                      </span>
                      {quiz.tag && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {quiz.tag.name}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {quizzes.length === 0 && !loading && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>Không có quiz nào. Hãy thử lại sau.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
