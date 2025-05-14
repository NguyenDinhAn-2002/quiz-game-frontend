import { AvatarParts } from '@/types';

// Convert avatar parts to string format
export const avatarPartsToString = (parts: AvatarParts): string => {
  return `${parts.hat}:${parts.glasses}:${parts.expression}:${parts.background}`;
};

// Parse avatar string to parts
export const parseAvatarString = (avatarString: string): AvatarParts => {
  const [hat, glasses, expression, background] = avatarString.split(':');
  return {
    hat: hat || 'none',
    glasses: glasses || 'none',
    expression: expression || 'smile',
    background: background || 'blue'
  };
};

// Generate a random avatar configuration
export const generateRandomAvatar = (): AvatarParts => {
  const hats = ['none', 'cap', 'party', 'graduation', 'crown'];
  const glasses = ['none', 'round', 'square', 'sunglasses'];
  const expressions = ['smile', 'laugh', 'wink', 'surprised', 'serious'];
  const backgrounds = ['blue', 'green', 'purple', 'orange', 'red'];

  return {
    hat: hats[Math.floor(Math.random() * hats.length)],
    glasses: glasses[Math.floor(Math.random() * glasses.length)],
    expression: expressions[Math.floor(Math.random() * expressions.length)],
    background: backgrounds[Math.floor(Math.random() * backgrounds.length)]
  };
};

// Generate random fun names
export const generateRandomName = (): string => {
  const randomNames = [
    'QuizWizard', 'BrainStorm', 'QuizNinja', 'MindMaster', 
    'TriviaTiger', 'QuestionQueen', 'KnowledgeKnight', 'PuzzleProdigy',
    'QuizGenius', 'BrainBox', 'QuizChampion', 'TriviaTitan'
  ];
  
  return randomNames[Math.floor(Math.random() * randomNames.length)];
};
