import { AvatarParts } from '@/types';

interface AvatarDisplayProps {
  avatarParts: AvatarParts;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const AvatarDisplay = ({ 
  avatarParts, 
  size = 'medium', 
  className = '' 
}: AvatarDisplayProps) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  // Background color mapping
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  // Get expression component
  const renderExpression = () => {
    switch (avatarParts.expression) {
      case 'smile':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/4 bg-black rounded-b-full"></div>
          </div>
        );
      case 'laugh':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/4 bg-black rounded-full"></div>
          </div>
        );
      case 'wink':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-1 bg-black"></div>
            </div>
          </div>
        );
      case 'surprised':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/4 h-1/4 bg-black rounded-full"></div>
          </div>
        );
      case 'serious':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1 bg-black"></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Get glasses component
  const renderGlasses = () => {
    switch (avatarParts.glasses) {
      case 'round':
        return (
          <div className="absolute top-1/3 left-0 right-0 flex justify-center">
            <div className="flex gap-1 bg-gray-800 h-1 items-center">
              <div className="w-3 h-3 rounded-full border-2 border-gray-800"></div>
              <div className="w-3 h-3 rounded-full border-2 border-gray-800"></div>
            </div>
          </div>
        );
      case 'square':
        return (
          <div className="absolute top-1/3 left-0 right-0 flex justify-center">
            <div className="flex gap-1 bg-gray-800 h-1 items-center">
              <div className="w-3 h-3 border-2 border-gray-800"></div>
              <div className="w-3 h-3 border-2 border-gray-800"></div>
            </div>
          </div>
        );
      case 'sunglasses':
        return (
          <div className="absolute top-1/3 left-0 right-0 flex justify-center">
            <div className="flex gap-1 bg-gray-800 h-1 items-center">
              <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
              <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Get hat component
  const renderHat = () => {
    switch (avatarParts.hat) {
      case 'cap':
        return (
          <div className="absolute -top-1/4 left-0 right-0 flex justify-center">
            <div className="w-3/4 h-3 bg-blue-600 rounded-t-lg"></div>
          </div>
        );
      case 'party':
        return (
          <div className="absolute -top-1/3 left-1/3 flex justify-center">
            <div className="w-0 h-0 
                border-l-[8px] border-l-transparent
                border-b-[16px] border-b-yellow-500
                border-r-[8px] border-r-transparent"></div>
          </div>
        );
      case 'graduation':
        return (
          <div className="absolute -top-1/4 left-0 right-0 flex justify-center">
            <div className="w-3/4 h-3 bg-black">
              <div className="w-4 h-1 bg-yellow-500 absolute right-0"></div>
            </div>
          </div>
        );
      case 'crown':
        return (
          <div className="absolute -top-1/4 left-0 right-0 flex justify-center">
            <div className="w-3/4 h-3 bg-yellow-500 relative">
              <div className="absolute -top-2 left-1/4 w-1 h-3 bg-yellow-500"></div>
              <div className="absolute -top-2 left-1/2 w-1 h-3 bg-yellow-500"></div>
              <div className="absolute -top-2 left-3/4 w-1 h-3 bg-yellow-500"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      <div className={`absolute inset-0 ${bgColors[avatarParts.background] || 'bg-gray-300'}`} />
      
      {renderExpression()}
      {renderGlasses()}
      {renderHat()}
    </div>
  );
};
