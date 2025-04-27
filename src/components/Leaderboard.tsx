import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface Player {
  name: string;
  score: number;
  avatar: string;
}

interface LeaderboardProps {
  players: Player[];
}

export const Leaderboard = ({ players }: LeaderboardProps) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Cập nhật kích thước cửa sổ khi thay đổi kích thước
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sắp xếp người chơi theo điểm số giảm dần
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topPlayers = sortedPlayers.slice(0, 3);

  // Hiệu ứng kim tuyến cho người chiến thắng
  useEffect(() => {
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
      confettiContainer.innerHTML = ''; // Xóa kim tuyến cũ nếu có

      // Tạo hiệu ứng kim tuyến
      for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#FFD166', '#4ECDC4', '#FF6B6B', '#9b87f5'][Math.floor(Math.random() * 4)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animation = `confettiRain 5s ease-in forwards`;
        confetti.style.animationDelay = Math.random() * 5 + 's';

        confettiContainer.appendChild(confetti);
      }
    }
  }, [topPlayers]);

  if (players.length === 0) {
    return <div>No players in the game</div>;
  }

  return (
    <div className="relative">
      {/* Container kim tuyến */}
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none" />

      {/* Hiệu ứng kim tuyến cho người chiến thắng */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        gravity={0.3}
        recycle={false}
      />

      <div className="max-w-3xl mx-auto text-center mt-8">
        <h2 className="text-3xl font-bold text-game-primary">Final Scores</h2>

        {/* Podium cho top 3 */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          {topPlayers.map((player, index) => (
            <div key={player.name} className="flex flex-col items-center space-y-2">
              <div className={`relative mb-2`}>
                <div className={`w-20 h-20 rounded-full border-4 ${index === 0 ? 'border-yellow-400' : 'border-gray-300'} overflow-hidden flex items-center justify-center bg-gray-100`}>
                  <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">{index + 1}</div>
              </div>
              <p className="font-bold text-lg">{player.name}</p>
              <p className="text-2xl">{player.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
