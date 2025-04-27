import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/QuizCard";
import { useGame } from "@/contexts/GameContext";
import { AvatarCustomizer } from "@/components/AvatarCustomizer";
import { fetchQuizzes } from "@/services/quiz"; // Thay đổi: import API mới

const Home = () => {
  const navigate = useNavigate();
  const { joinRoom, playerName, setPlayerName, avatar, setAvatar } = useGame();

  const [roomPin, setRoomPin] = useState("");
  const [nameError, setNameError] = useState("");
  const [pinError, setPinError] = useState("");
  const [quizzes, setQuizzes] = useState([]); // Thay đổi: lấy dữ liệu từ API
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state nếu fetch thất bại

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        console.log("Fetching quizzes...");
        const data = await fetchQuizzes();
        console.log("Fetched quizzes:", data); // Kiểm tra dữ liệu quiz đã tải
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleJoinRoom = async () => {
    setNameError("");
    setPinError("");

    if (!playerName.trim()) {
      setNameError("Please enter your name");
      return;
    }

    if (!roomPin.trim()) {
      setPinError("Please enter a room PIN");
      return;
    }

    console.log(
      "Joining room with PIN:",
      roomPin,
      "and Player Name:",
      playerName
    );

    const success = await joinRoom(roomPin, playerName, avatar);
    if (success) {
      console.log("Successfully joined room. Navigating to lobby...");
      navigate(`/lobby/${roomPin}`);
    } else {
      console.log("Failed to join room");
    }
  };

  return (
    <div className="game-container min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-game-primary animate-bounce-in mb-2">
            Quiz Party Time
          </h1>
          <p
            className="text-lg text-gray-600 animate-slide-in"
            style={{ animationDelay: "0.3s" }}
          >
            Join a quiz, customize your avatar, and compete with friends!
          </p>
        </header>

        {/* Join Game Section */}
        <div
  className="max-w-md mx-auto bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl shadow-lg p-6 mb-12 animate-bounce-in"
  style={{
    animationDelay: "0.5s",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 10px 20px rgba(255, 255, 255, 0.3)', // Thêm hiệu ứng ánh sáng
  }}
>
  <h2 className="text-3xl font-bold mb-4 text-center text-white drop-shadow-lg">
    Join a Game
  </h2>

  {/* Player Setup */}
  <div className="mb-6">
    <div className="flex items-center gap-4 mb-4">
      <AvatarCustomizer initialAvatar={avatar} onSave={setAvatar} />
      <div className="flex-1">
        <Input
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className={`mb-1 ${nameError ? "border-red-500" : ""}`}
          maxLength={15}
        />
        {nameError && (
          <p className="text-red-500 text-xs">{nameError}</p>
        )}
      </div>
    </div>
  </div>

  {/* Room PIN */}
  <div className="mb-4">
    <Input
      placeholder="Enter Room PIN"
      value={roomPin}
      onChange={(e) => setRoomPin(e.target.value)}
      className={`text-center text-xl font-bold tracking-wider ${
        pinError ? "border-red-500" : ""
      }`}
      maxLength={6}
    />
    {pinError && (
      <p className="text-red-500 text-xs text-center mt-1">
        {pinError}
      </p>
    )}
  </div>

  <Button
    onClick={handleJoinRoom}
    className="w-full py-6 text-lg bg-game-primary hover:bg-game-primary/90 text-white"
    style={{ borderRadius: "1.5rem", boxShadow: "0 4px 10px rgba(255, 255, 255, 0.4)" }}
  >
    Join Quiz
  </Button>
</div>


        {/* Available Quizzes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Host a Quiz</h2>

          {/* Loading state */}
          {loading && (
            <div className="text-center text-gray-500">Loading quizzes...</div>
          )}

          {/* Error state */}
          {error && <div className="text-center text-red-500">{error}</div>}

          {/* Quizzes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)
            ) : (
              <div>No quizzes available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
