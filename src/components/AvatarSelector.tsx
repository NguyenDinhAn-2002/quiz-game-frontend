import React, { useState, useEffect } from 'react';
import { X, Shuffle } from 'lucide-react';
import avatar1 from '@/assets/avatars/avatar1.png';
import avatar2 from '@/assets/avatars/avatar2.png';
import avatar3 from '@/assets/avatars/avatar3.png';
import avatar4 from '@/assets/avatars/avatar4.png';
import avatar5 from '@/assets/avatars/avatar5.png';
import avatar6 from '@/assets/avatars/avatar6.png';

interface AvatarSelectorProps {
  onDone: (name: string, avatar: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const avatarImages = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const generateRandomName = () => {
  const adjectives = ['Cool', 'Smart', 'Quick', 'Brave', 'Funny', 'Happy'];
  const nouns = ['Player', 'Gamer', 'Quiz', 'Master', 'Star', 'Hero'];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNum}`;
};

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onDone, onCancel, isOpen }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(avatarImages[0]);

  useEffect(() => {
    if (isOpen) randomizeAvatar();
  }, [isOpen]);

  const randomizeAvatar = () => {
    setName(generateRandomName());
    const randomAvatar = avatarImages[Math.floor(Math.random() * avatarImages.length)];
    setAvatar(randomAvatar);
  };

  const isValidName = name.length >= 3 && name.length <= 20;

  const handleDone = () => {
    if (isValidName) {
      onDone(name, avatar);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-400 shadow-md mb-2">
              <img src={avatar} alt="Selected Avatar" className="w-full h-full object-cover" />
            </div>
            <p className="text-lg font-semibold text-gray-700">{name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tên trong game</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name..."
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{name.length}/20 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Chọn Avatar</label>
            <div className="grid grid-cols-3 gap-3">
              {avatarImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setAvatar(img)}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-200 shadow-sm ${
                    avatar === img ? 'border-purple-500 ring-2 ring-purple-300' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`Avatar ${index + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              onClick={randomizeAvatar}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Shuffle size={20} /> Ngẫu nhiên
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Thoát
            </button>
            <button
              onClick={handleDone}
              disabled={!isValidName}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isValidName
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Xong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};