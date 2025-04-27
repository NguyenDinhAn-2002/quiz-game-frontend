
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGame } from '@/contexts/GameContext';
import { AvatarCustomizer } from '@/components/AvatarCustomizer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getQuizById } from '@/services/quiz'; // <-- thêm dòng này

const Host = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { playerName, setPlayerName, avatar, setAvatar, createRoom } = useGame();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nameError, setNameError] = useState('');
  const [joinAsPlayer, setJoinAsPlayer] = useState(true);
  const [activeTab, setActiveTab] = useState('host');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!quizId || isNaN(Number(quizId))) {
          console.error('Invalid quizId:', quizId); // Debugging
          navigate('/'); // Điều hướng về trang chính nếu quizId không hợp lệ
          return;
        }
        const data = await getQuizById(Number(quizId)); // Chuyển quizId thành số
        setQuiz(data);
      } catch (error) {
        console.error(error);
        navigate('/'); // Điều hướng về trang chính nếu gặp lỗi
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuiz();
  }, [quizId, navigate]);
  

  const handleHostGame = async () => {
    setNameError('');

    if (!playerName.trim()) {
      setNameError('Please enter your name');
      return;
    }

    if (!quiz) return;

    const pin = await createRoom(quiz.id, playerName, avatar, joinAsPlayer);
    if (pin) {
      navigate(`/lobby/${pin}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading quiz...</div>;
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="game-container min-h-screen p-4">
      <div className="max-w-3xl mx-auto pt-8 pb-16">
        <Tabs defaultValue="host" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="host">Host Settings</TabsTrigger>
            <TabsTrigger value="details">Quiz Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="host">
            <Card className="animate-bounce-in">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Host "{quiz.title}"</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Host Details */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <AvatarCustomizer 
                        initialAvatar={avatar} 
                        onSave={setAvatar} 
                      />
                      
                      <div className="w-full">
                        <Label htmlFor="host-name">Your Name</Label>
                        <Input
                          id="host-name"
                          placeholder="Enter your name"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          className={nameError ? 'border-red-500' : ''}
                          maxLength={15}
                        />
                        {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="join-as-player"
                        checked={joinAsPlayer}
                        onCheckedChange={setJoinAsPlayer}
                      />
                      <Label htmlFor="join-as-player">Join as a player (vs. spectator only)</Label>
                    </div>
                  </div>
                  
                  {/* Host Instructions */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">As a host, you can:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Control when the game starts</li>
                      <li>Advance to the next question</li>
                      <li>Kick players from the game</li>
                      <li>View everyone's scores in real-time</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={handleHostGame}
                    className="w-full py-6 text-lg bg-game-primary hover:bg-game-primary/90"
                  >
                    Create Game Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card className="animate-bounce-in">
              <CardHeader>
                <CardTitle className="text-2xl text-center">{quiz.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quiz Image */}
                {quiz.thumbnail && (
                  <div className="overflow-hidden rounded-lg">
                    <img 
                      src={quiz.thumbnail} 
                      alt={quiz.title} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                {/* Quiz Description */}
                <div>
                  <h3 className="font-bold mb-1">Description</h3>
                  <p className="text-gray-700">{quiz.description || "No description provided."}</p>
                </div>
                
                {/* Quiz Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-game-primary">5</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-game-primary">20</div>
                    <div className="text-sm text-gray-600">Avg. Time (min)</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => setActiveTab('host')} className="w-full">
                    Continue to Host Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Host;

