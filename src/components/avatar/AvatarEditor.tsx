import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarDisplay } from './AvatarDisplay';
import { AvatarSelector } from './AvatarSelector';
import { AvatarParts } from '@/types';

interface AvatarEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, avatarString: string) => void;
  defaultName?: string;
  defaultAvatar?: string;
}

// Avatar parts options
const avatarOptions = {
  hat: ['none', 'cap', 'party', 'graduation', 'crown'],
  glasses: ['none', 'round', 'square', 'sunglasses'],
  expression: ['smile', 'laugh', 'wink', 'surprised', 'serious'],
  background: ['blue', 'green', 'purple', 'orange', 'red']
};

// Generate a random avatar configuration
const generateRandomAvatar = (): AvatarParts => {
  return {
    hat: avatarOptions.hat[Math.floor(Math.random() * avatarOptions.hat.length)],
    glasses: avatarOptions.glasses[Math.floor(Math.random() * avatarOptions.glasses.length)],
    expression: avatarOptions.expression[Math.floor(Math.random() * avatarOptions.expression.length)],
    background: avatarOptions.background[Math.floor(Math.random() * avatarOptions.background.length)]
  };
};

// Convert avatar parts to string format
const avatarPartsToString = (parts: AvatarParts): string => {
  return `${parts.hat}:${parts.glasses}:${parts.expression}:${parts.background}`;
};

// Parse avatar string to parts
const parseAvatarString = (avatarString: string): AvatarParts => {
  const [hat, glasses, expression, background] = avatarString.split(':');
  return {
    hat: hat || 'none',
    glasses: glasses || 'none',
    expression: expression || 'smile',
    background: background || 'blue'
  };
};

// Generate random fun names
const randomNames = [
  'QuizWizard', 'BrainStorm', 'QuizNinja', 'MindMaster', 
  'TriviaTiger', 'QuestionQueen', 'KnowledgeKnight', 'PuzzleProdigy',
  'QuizGenius', 'BrainBox', 'QuizChampion', 'TriviaTitan'
];

export const AvatarEditor = ({ open, onClose, onSave, defaultName = '', defaultAvatar = '' }: AvatarEditorProps) => {
  const [name, setName] = useState(defaultName || '');
  const [avatarParts, setAvatarParts] = useState<AvatarParts>(
    defaultAvatar ? parseAvatarString(defaultAvatar) : generateRandomAvatar()
  );

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, avatarPartsToString(avatarParts));
      onClose();
    }
  };

  const generateRandom = () => {
    setName(randomNames[Math.floor(Math.random() * randomNames.length)]);
    setAvatarParts(generateRandomAvatar());
  };

  const updateAvatarPart = (part: keyof AvatarParts, value: string) => {
    setAvatarParts(prev => ({ ...prev, [part]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Tùy chỉnh nhân vật</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <AvatarDisplay avatarParts={avatarParts} size="large" />
          
          <Input
            placeholder="Nhập tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-[300px]"
          />
          
          <div className="space-y-4 w-full max-w-[300px]">
            <AvatarSelector
              title="Mũ"
              options={avatarOptions.hat}
              selected={avatarParts.hat}
              onChange={(value) => updateAvatarPart('hat', value)}
            />
            
            <AvatarSelector
              title="Kính"
              options={avatarOptions.glasses}
              selected={avatarParts.glasses}
              onChange={(value) => updateAvatarPart('glasses', value)}
            />
            
            <AvatarSelector
              title="Biểu cảm"
              options={avatarOptions.expression}
              selected={avatarParts.expression}
              onChange={(value) => updateAvatarPart('expression', value)}
            />
            
            <AvatarSelector
              title="Nền"
              options={avatarOptions.background}
              selected={avatarParts.background}
              onChange={(value) => updateAvatarPart('background', value)}
              isColor
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={generateRandom}
          >
            Random
          </Button>
          <Button 
            className="w-full sm:w-auto"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
