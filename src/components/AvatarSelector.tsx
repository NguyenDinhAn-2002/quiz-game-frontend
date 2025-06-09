import  React, {useState}  from 'react';
import { X, Shuffle } from 'lucide-react';

interface AvatarSelectorProps {
  onDone: (name: string, avatar: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const avatarOptions = {
  hat: ['👒', '🎩', '🧢', '⛑️', '🎓', ''],
  glasses: ['👓', '🕶️', '🥽', ''],
  eyes: ['👀', '😊', '😎', '🤔', '😄'],
  mouth: ['😊', '😃', '😄', '🙂', '😆'],
  background: ['🌟', '🎨', '🌈', '⭐', '🎪']
};

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onDone, onCancel, isOpen }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState({
    hat: '',
    glasses: '',
    eyes: '😊',
    mouth: '😊',
    background: '🌟'
  });

  const generateRandomName = () => {
    const adjectives = ['Cool', 'Smart', 'Quick', 'Brave', 'Funny', 'Happy'];
    const nouns = ['Player', 'Gamer', 'Quiz', 'Master', 'Star', 'Hero'];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNum}`;
  };

  const randomizeAvatar = () => {
    setName(generateRandomName());
    setSelectedAvatar({
      hat: avatarOptions.hat[Math.floor(Math.random() * avatarOptions.hat.length)],
      glasses: avatarOptions.glasses[Math.floor(Math.random() * avatarOptions.glasses.length)],
      eyes: avatarOptions.eyes[Math.floor(Math.random() * avatarOptions.eyes.length)],
      mouth: avatarOptions.mouth[Math.floor(Math.random() * avatarOptions.mouth.length)],
      background: avatarOptions.background[Math.floor(Math.random() * avatarOptions.background.length)]
    });
  };

  const generateAvatarString = () => {
    // Ensure we always return a string, never an object
    const avatarString = `${selectedAvatar.background}${selectedAvatar.hat}${selectedAvatar.glasses}${selectedAvatar.eyes}${selectedAvatar.mouth}`;
    console.log('Generated avatar string:', avatarString);
    return avatarString;
  };

  const isValidName = name.length >= 3 && name.length <= 20;
  const isValidAvatar = selectedAvatar.eyes && selectedAvatar.mouth && selectedAvatar.background;

  const handleDone = () => {
    if (isValidName && isValidAvatar) {
      const avatarString = generateAvatarString();
      console.log('Calling onDone with:', { name, avatar: avatarString });
      onDone(name, avatarString);
    }
  };

  if (!isOpen) return null;

  // Generate avatar string for preview
  const previewAvatar = generateAvatarString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create Your Avatar</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Customization */}
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name (3-20 characters)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isValidName ? 'border-green-300' : 'border-gray-300'
                }`}
                placeholder="Enter your name..."
                maxLength={20}
              />
              <p className="text-sm text-gray-500 mt-1">{name.length}/20 characters</p>
            </div>

            {/* Avatar Customization */}
            <div className="space-y-4">
              {Object.entries(avatarOptions).map(([category, options]) => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {category}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAvatar(prev => ({ ...prev, [category]: option }))}
                        className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-2xl hover:border-purple-500 transition-colors ${
                          selectedAvatar[category as keyof typeof selectedAvatar] === option
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300'
                        }`}
                      >
                        {option || '❌'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
              <div className="w-32 h-32 rounded-full border-4 border-purple-200 flex items-center justify-center text-6xl bg-gradient-to-br from-purple-100 to-pink-100">
                {previewAvatar}
              </div>
              <p className="text-lg font-medium text-gray-800 mt-4">{name || 'Your Name'}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 w-full max-w-xs">
              <button
                onClick={randomizeAvatar}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Shuffle size={20} />
                Random
              </button>
              
              <button
                onClick={handleDone}
                disabled={!isValidName || !isValidAvatar}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                  isValidName && isValidAvatar
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Done
              </button>
              
              <button
                onClick={onCancel}
                className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};