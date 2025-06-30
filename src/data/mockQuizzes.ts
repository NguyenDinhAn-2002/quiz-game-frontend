import { Quiz, Question, Option } from '../types';

export const mockQuizzes: Quiz[] = [
  {
    _id: '1',
    title: 'General Knowledge',
    description: 'Test your knowledge about various topics',
    thumbnail: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=1000',
    created_by: 'Admin',
  },
  {
    _id: '2',
    title: 'Science Quiz',
    description: 'Explore the wonders of science',
    thumbnail: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=1000',
    created_by: 'Teacher',
  },
  {
    _id: '3',
    title: 'Music Trivia',
    description: 'Test your music knowledge',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000',
    created_by: 'MusicLover',
  },
  {
    _id: '4',
    title: 'Geography Challenge',
    description: 'How well do you know the world?',
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1000',
    created_by: 'Traveler',
  },
  {
    _id: '5',
    title: 'Movie Quotes',
    description: 'Famous lines from popular films',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000',
    created_by: 'FilmBuff',
  },
  {
    _id: '6',
    title: 'Math Problems',
    description: 'Challenge your mathematical skills',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000',
    created_by: 'MathTeacher',
  },
];

export const mockQuestions: Record<string, Question[]> = {
  '1': [
    {
      id: '101',
      quiz_id: '1',
      questionText: 'What is the capital of France?',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000',
      },
      questionType: 'single',
      options: [
        { id: '1001', question_id: '101', text: 'London', isCorrect: false },
        { id: '1002', question_id: '101', text: 'Berlin', isCorrect: false },
        { id: '1003', question_id: '101', text: 'Paris', isCorrect: true },
        { id: '1004', question_id: '101', text: 'Rome', isCorrect: false },
      ],
      timeLimit: 15,
    },
    {
      id: '102',
      quiz_id: '1',
      questionText: 'Which planet is known as the Red Planet?',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000',
      },
      questionType: 'single',
      options: [
        { id: '1005', question_id: '102', text: 'Venus', isCorrect: false },
        { id: '1006', question_id: '102', text: 'Mars', isCorrect: true },
        { id: '1007', question_id: '102', text: 'Jupiter', isCorrect: false },
        { id: '1008', question_id: '102', text: 'Saturn', isCorrect: false },
      ],
      timeLimit: 15,
    },
    {
      id: '103',
      quiz_id: '1',
      questionText: 'Who wrote the play "Romeo and Juliet"?',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=1000',
      },
      questionType: 'single',
      options: [
        { id: '1009', question_id: '103', text: 'Charles Dickens', isCorrect: false },
        { id: '1010', question_id: '103', text: 'William Shakespeare', isCorrect: true },
        { id: '1011', question_id: '103', text: 'Jane Austen', isCorrect: false },
        { id: '1012', question_id: '103', text: 'Leo Tolstoy', isCorrect: false },
      ],
      timeLimit: 15,
    },
  ],
  '2': [
    {
      id: '201',
      quiz_id: '2',
      questionText: 'What is the chemical symbol for gold?',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1000',
      },
      questionType: 'single',
      options: [
        { id: '2001', question_id: '201', text: 'Au', isCorrect: true },
        { id: '2002', question_id: '201', text: 'Ag', isCorrect: false },
        { id: '2003', question_id: '201', text: 'Fe', isCorrect: false },
        { id: '2004', question_id: '201', text: 'Cu', isCorrect: false },
      ],
      timeLimit: 15,
    },
    {
      id: '202',
      quiz_id: '2',
      questionText: 'What is the largest organ in the human body?',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=1000',
      },
      questionType: 'single',
      options: [
        { id: '2005', question_id: '202', text: 'Heart', isCorrect: false },
        { id: '2006', question_id: '202', text: 'Liver', isCorrect: false },
        { id: '2007', question_id: '202', text: 'Skin', isCorrect: true },
        { id: '2008', question_id: '202', text: 'Brain', isCorrect: false },
      ],
      timeLimit: 15,
    },
  ],
  '3': [
    {
      id: '301',
      quiz_id: '3',
      questionText: 'Which band performed "Bohemian Rhapsody"?',
      media: {
        type: 'audio',
        url: 'https://example.com/bohemian-rhapsody.mp3', // Mock URL
      },
      questionType: 'single',
      options: [
        { id: '3001', question_id: '301', text: 'The Beatles', isCorrect: false },
        { id: '3002', question_id: '301', text: 'Led Zeppelin', isCorrect: false },
        { id: '3003', question_id: '301', text: 'Queen', isCorrect: true },
        { id: '3004', question_id: '301', text: 'The Rolling Stones', isCorrect: false },
      ],
      timeLimit: 20,
    },
  ],
  '4': [
    {
      id: '401',
      quiz_id: '4',
      questionText: 'Which country has the most natural lakes?',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1000',
      },
      questionType: 'single',
      options: [
        { id: '4001', question_id: '401', text: 'United States', isCorrect: false },
        { id: '4002', question_id: '401', text: 'Russia', isCorrect: false },
        { id: '4003', question_id: '401', text: 'Canada', isCorrect: true },
        { id: '4004', question_id: '401', text: 'Finland', isCorrect: false },
      ],
      timeLimit: 15,
    },
  ],
  '5': [
    {
      id: '501',
      quiz_id: '5',
      questionText: 'From which movie is the quote "May the Force be with you"?',
      media: {
        type: 'text',
      },
      questionType: 'single',
      options: [
        { id: '5001', question_id: '501', text: 'The Matrix', isCorrect: false },
        { id: '5002', question_id: '501', text: 'Star Wars', isCorrect: true },
        { id: '5003', question_id: '501', text: 'Star Trek', isCorrect: false },
        { id: '5004', question_id: '501', text: 'The Lord of the Rings', isCorrect: false },
      ],
      timeLimit: 15,
    },
  ],
  '6': [
    {
      id: '601',
      quiz_id: '6',
      questionText: 'What is 12 × 8?',
      media: {
        type: 'text',
      },
      questionType: 'single',
      options: [
        { id: '6001', question_id: '601', text: '86', isCorrect: false },
        { id: '6002', question_id: '601', text: '92', isCorrect: false },
        { id: '6003', question_id: '601', text: '96', isCorrect: true },
        { id: '6004', question_id: '601', text: '102', isCorrect: false },
      ],
      timeLimit: 15,
    },
  ],
};

export const mockAvatars = [
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fluffy',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bella',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Luna',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Max',
];