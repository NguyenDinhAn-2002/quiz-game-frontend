import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { avatarColors, avatarHats, avatarEyes, avatarMouths, avatarAccessories } from '@/lib/mockData';
import { AvatarParts } from '@/types';

interface AvatarCustomizerProps {
  initialAvatar: string;
  onSave: (avatar: string) => void;
}

export const AvatarCustomizer = ({ initialAvatar, onSave }: AvatarCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState<AvatarParts>({
    baseColor: '#4ECDC4',
    hat: undefined,
    eyes: 'normal',
    mouth: 'smile',
    accessory: undefined
  });

  // Parse initial avatar if available
  useEffect(() => {
    if (initialAvatar) {
      try {
        const parsedAvatar = JSON.parse(initialAvatar);
        if (parsedAvatar) {
          setAvatar(parsedAvatar);
        }
      } catch (e) {
        console.error('Error parsing avatar:', e);
      }
    }
  }, [initialAvatar]);

  const handleSave = () => {
    onSave(JSON.stringify(avatar));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <div className="flex flex-col items-center cursor-pointer">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-2 border-4" 
          style={{
            borderColor: avatar.baseColor,
            backgroundColor: avatar.baseColor,
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(236, 72, 153, 0.5)' // Updated for galaxy theme
          }}
        >
          <AvatarDisplay avatar={avatar} size="lg" />
        </div>
        <Button variant="outline" size="sm" className="bg-transparent border-2 border-white text-white hover:bg-space-accent1">
          Customize
        </Button>
      </div>
    </DialogTrigger>
    
    <DialogContent className="max-w-md bg-gradient-to-t from-space-accent1 via-space-accent2 to-space-accent3 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Customize Your Avatar</h2>
      
      <div className="flex justify-center mb-6">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4" 
          style={{
            borderColor: avatar.baseColor,
            backgroundColor: avatar.baseColor,
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(236, 72, 153, 0.5)' // Updated for galaxy theme
          }}
        >
          <AvatarDisplay avatar={avatar} size="xl" />
        </div>
      </div>
      
      <ScrollArea className="h-60 pr-4">
        {/* Color selection */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Color</h3>
          <div className="flex flex-wrap gap-2">
            {avatarColors.map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                  avatar.baseColor === color ? 'border-white' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: avatar.baseColor === color ? '0 0 20px rgba(139, 92, 246, 0.6)' : ''
                }}
                onClick={() => setAvatar({ ...avatar, baseColor: color })}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Hat selection */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Hat</h3>
          <RadioGroup 
            value={avatar.hat || 'none'} 
            onValueChange={(value) => setAvatar({ ...avatar, hat: value === 'none' ? undefined : value })}
            className="grid grid-cols-3 gap-2"
          >
            {avatarHats.map((hat) => (
              <div key={hat} className="flex items-center space-x-2">
                <RadioGroupItem value={hat} id={`hat-${hat}`} className="sr-only" />
                <Label 
                  htmlFor={`hat-${hat}`} 
                  className={`flex-1 flex flex-col items-center p-2 ${
                    (avatar.hat || 'none') === hat ? 'bg-space-accent1 text-white' : 'bg-transparent text-white'
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-1 flex items-center justify-center">
                    {getHatIcon(hat)}
                  </div>
                  <span className="text-xs capitalize">{hat === 'none' ? 'No Hat' : hat}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Eyes selection */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Eyes</h3>
          <RadioGroup 
            value={avatar.eyes} 
            onValueChange={(value) => setAvatar({ ...avatar, eyes: value })}
            className="grid grid-cols-3 gap-2"
          >
            {avatarEyes.map((eye) => (
              <div key={eye} className="flex items-center space-x-2">
                <RadioGroupItem value={eye} id={`eye-${eye}`} className="sr-only" />
                <Label 
                  htmlFor={`eye-${eye}`} 
                  className={`flex-1 flex flex-col items-center p-2 ${
                    avatar.eyes === eye ? 'bg-space-accent1 text-white' : 'bg-transparent text-white'
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-1 flex items-center justify-center">
                    {getEyesIcon(eye)}
                  </div>
                  <span className="text-xs capitalize">{eye}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Mouth selection */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Mouth</h3>
          <RadioGroup 
            value={avatar.mouth} 
            onValueChange={(value) => setAvatar({ ...avatar, mouth: value })}
            className="grid grid-cols-3 gap-2"
          >
            {avatarMouths.map((mouth) => (
              <div key={mouth} className="flex items-center space-x-2">
                <RadioGroupItem value={mouth} id={`mouth-${mouth}`} className="sr-only" />
                <Label 
                  htmlFor={`mouth-${mouth}`} 
                  className={`flex-1 flex flex-col items-center p-2 ${
                    avatar.mouth === mouth ? 'bg-space-accent1 text-white' : 'bg-transparent text-white'
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-1 flex items-center justify-center">
                    {getMouthIcon(mouth)}
                  </div>
                  <span className="text-xs capitalize">{mouth}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Accessory selection */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Accessory</h3>
          <RadioGroup 
            value={avatar.accessory || 'none'} 
            onValueChange={(value) => setAvatar({ ...avatar, accessory: value === 'none' ? undefined : value })}
            className="grid grid-cols-3 gap-2"
          >
            {avatarAccessories.map((accessory) => (
              <div key={accessory} className="flex items-center space-x-2">
                <RadioGroupItem value={accessory} id={`accessory-${accessory}`} className="sr-only" />
                <Label 
                  htmlFor={`accessory-${accessory}`} 
                  className={`flex-1 flex flex-col items-center p-2 ${
                    avatar.accessory === accessory ? 'bg-space-accent1 text-white' : 'bg-transparent text-white'
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-1 flex items-center justify-center">
                    {getAccessoryIcon(accessory)}
                  </div>
                  <span className="text-xs capitalize">{accessory}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </ScrollArea>
      
      <div className="mt-4 flex justify-center">
        <Button onClick={handleSave} className="bg-space-accent1 hover:bg-space-accent2 text-black">
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  
  
  );
};

// Helper component to display avatar
export const AvatarDisplay = ({ avatar, size = "md" }: { avatar: AvatarParts | string, size?: "sm" | "md" | "lg" | "xl" }) => {
  const [parsedAvatar, setParsedAvatar] = useState<AvatarParts | null>(null);
  
  useEffect(() => {
    if (typeof avatar === 'string') {
      try {
        setParsedAvatar(JSON.parse(avatar));
      } catch (e) {
        console.error('Error parsing avatar string:', e);
        setParsedAvatar(null);
      }
    } else {
      setParsedAvatar(avatar);
    }
  }, [avatar]);

  if (!parsedAvatar) {
    return (
      <div className={`
        ${size === "sm" ? "text-xs" : ""}
        ${size === "md" ? "text-sm" : ""}
        ${size === "lg" ? "text-base" : ""}
        ${size === "xl" ? "text-xl" : ""}
      `}>
        👤
      </div>
    );
  }

  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center ${sizeClass} rounded-full`}
      style={{ backgroundColor: parsedAvatar.baseColor }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyes */}
        <div className="flex justify-center items-center space-x-1 mt-1">
          {getEyesIcon(parsedAvatar.eyes)}
        </div>
        
        {/* Mouth */}
        <div className="mt-1">
          {getMouthIcon(parsedAvatar.mouth)}
        </div>
        
        {/* Hat - positioned at the top */}
        {parsedAvatar.hat && parsedAvatar.hat !== 'none' && (
          <div className="absolute" style={{ top: '-30%' }}>
            {getHatIcon(parsedAvatar.hat)}
          </div>
        )}
        
        {/* Accessory */}
        {parsedAvatar.accessory && parsedAvatar.accessory !== 'none' && (
          <div className="absolute" style={{ bottom: '20%' }}>
            {getAccessoryIcon(parsedAvatar.accessory)}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple icon functions - in a real app, these would be SVG components
function getHatIcon(hat: string) {
  switch (hat) {
    case 'partyHat':
      return <div className="text-blue-500">🎉</div>;
    case 'cowboyHat':
      return <div>🤠</div>;
    case 'propellerHat':
      return <div>🧢</div>;
    case 'crown':
      return <div>👑</div>;
    case 'wizard':
      return <div>🧙‍♂️</div>;
    case 'none':
    default:
      return <div>❌</div>;
  }
}

function getEyesIcon(eyes: string) {
  switch (eyes) {
    case 'happy':
      return <div className="flex space-x-2"><span>^</span><span>^</span></div>;
    case 'wink':
      return <div className="flex space-x-2"><span>•</span><span>^</span></div>;
    case 'surprised':
      return <div className="flex space-x-2"><span>O</span><span>O</span></div>;
    case 'sleepy':
      return <div className="flex space-x-2"><span>-</span><span>-</span></div>;
    case 'angry':
      return <div className="flex space-x-2"><span>ˋ</span><span>ˊ</span></div>;
    case 'normal':
    default:
      return <div className="flex space-x-2"><span>•</span><span>•</span></div>;
  }
}

function getMouthIcon(mouth: string) {
  switch (mouth) {
    case 'grin':
      return <div>D</div>;
    case 'surprised':
      return <div>O</div>;
    case 'neutral':
      return <div>―</div>;
    case 'sad':
      return <div>︵</div>;
    case 'smile':
    default:
      return <div>◡</div>;
  }
}

function getAccessoryIcon(accessory: string) {
  switch (accessory) {
    case 'glasses':
      return <div>👓</div>;
    case 'sunglasses':
      return <div>😎</div>;
    case 'mustache':
      return <div>👨</div>;
    case 'bow':
      return <div>🎀</div>;
    case 'none':
    default:
      return <div>❌</div>;
  }
}
