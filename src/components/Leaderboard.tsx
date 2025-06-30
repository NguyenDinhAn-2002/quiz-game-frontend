import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { FinalPlayer } from '../types';

interface LeaderboardProps {
  players: FinalPlayer[];
  title?: string;
  showPodium?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  title = "Leaderboard",
  showPodium = false
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const topThree = sortedPlayers.slice(0, 3);
  const remaining = sortedPlayers.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={24} />;
      case 2: return <Medal className="text-gray-400" size={24} />;
      case 3: return <Award className="text-amber-600" size={24} />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };


  const renderAvatar = (avatar: string) => {
    return avatar.startsWith('/') || avatar.startsWith('http') ? (
      <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
    ) : (
      <div className="text-3xl">{avatar}</div>
    );
  };

  if (showPodium && topThree.length >= 3) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{title}</h2>

        {/* Podium */}
        <div className="flex items-end justify-center mb-8 space-x-4">
          {/* 2nd */}
          <div className="flex flex-col items-center">
            <div className="mb-2">{renderAvatar(topThree[1].avatar)}</div>
            <div className="bg-gray-300 rounded-lg p-4 h-32 flex flex-col justify-end items-center min-w-[120px]">
              <Medal className="text-gray-500 mb-2" size={32} />
              <div className="text-center">
                <div className="font-bold text-gray-800">{topThree[1].name}</div>
                <div className="text-gray-600">{topThree[1].totalScore} pts</div>
              </div>
            </div>
            <div className="bg-gray-400 text-white px-3 py-1 rounded-b-lg font-bold">2nd</div>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center">
            <div className="mb-2">{renderAvatar(topThree[0].avatar)}</div>
            <div className="bg-yellow-300 rounded-lg p-4 h-40 flex flex-col justify-end items-center min-w-[140px]">
              <Trophy className="text-yellow-600 mb-2" size={40} />
              <div className="text-center">
                <div className="font-bold text-gray-800 text-lg">{topThree[0].name}</div>
                <div className="text-gray-700 font-semibold">{topThree[0].totalScore} pts</div>
              </div>
            </div>
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-b-lg font-bold">1st</div>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center">
            <div className="mb-2">{renderAvatar(topThree[2].avatar)}</div>
            <div className="bg-amber-200 rounded-lg p-4 h-28 flex flex-col justify-end items-center min-w-[120px]">
              <Award className="text-amber-600 mb-2" size={32} />
              <div className="text-center">
                <div className="font-bold text-gray-800">{topThree[2].name}</div>
                <div className="text-gray-600">{topThree[2].totalScore} pts</div>
              </div>
            </div>
            <div className="bg-amber-500 text-white px-3 py-1 rounded-b-lg font-bold">3rd</div>
          </div>
        </div>

        {/* Remaining players */}
        {remaining.length > 0 && (
          <div className="space-y-2">
            {remaining.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center">{getRankIcon(index + 4)}</div>
                  {renderAvatar(player.avatar)}
                  <div className="font-semibold text-gray-800">{player.name}</div>
                </div>
                <div className="text-lg font-bold text-purple-600">{player.totalScore} pts</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback regular list
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h2>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center">{getRankIcon(index + 1)}</div>
              {renderAvatar(player.avatar)}
              <div className="font-semibold text-gray-800">{player.name}</div>
            </div>
            <div className="text-lg font-bold text-purple-600">{player.score} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};
