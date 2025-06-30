import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { FinalPlayer } from '../types/quiz';

interface LeaderboardProps {
  players: FinalPlayer[];
  title?: string;
  showPodium?: boolean;
  useTotalScore?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  title = 'Leaderboard',
  showPodium = false,
  useTotalScore = true,
}) => {
  const sortedPlayers = [...players].sort((a, b) =>
    useTotalScore ? b.totalScore - a.totalScore : b.score - a.score
  );
  const topThree = sortedPlayers.slice(0, 3);
  const remaining = sortedPlayers.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const renderAvatar = (avatar: string) => {
    return avatar.startsWith('/') || avatar.startsWith('http') ? (
      <img
        src={avatar}
        alt="avatar"
        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
      />
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
          {[1, 0, 2].map((i, pos) => (
            <div key={i} className="flex flex-col items-center">
              <div className="mb-2">{renderAvatar(topThree[i].avatar)}</div>
              <div
                className={`rounded-lg p-4 flex flex-col justify-end items-center min-w-[120px] ${
                  i === 0
                    ? 'bg-yellow-300 h-40'
                    : i === 1
                    ? 'bg-gray-300 h-32'
                    : 'bg-amber-200 h-28'
                }`}
              >
                {getRankIcon(i + 1)}
                <div className="text-center">
                  <div className="font-bold text-gray-800 text-lg">{topThree[i].name}</div>
                  <div className="text-gray-600">
                    {useTotalScore ? topThree[i].totalScore : topThree[i].score} pts
                  </div>
                </div>
              </div>
              <div
                className={`text-white px-3 py-1 rounded-b-lg font-bold ${
                  i === 0
                    ? 'bg-yellow-500'
                    : i === 1
                    ? 'bg-gray-400'
                    : 'bg-amber-500'
                }`}
              >
                {i + 1}st
              </div>
            </div>
          ))}
        </div>

        {/* Remaining players */}
        {remaining.length > 0 && (
          <div className="space-y-2">
            {remaining.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getRankIcon(index + 4)}
                  </div>
                  {renderAvatar(player.avatar)}
                  <div className="font-semibold text-gray-800">{player.name}</div>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {useTotalScore ? player.totalScore : player.score} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback list
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h2>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center">
                {getRankIcon(index + 1)}
              </div>
              {renderAvatar(player.avatar)}
              <div className="font-semibold text-gray-800">{player.name}</div>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {useTotalScore ? player.totalScore : player.score} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
