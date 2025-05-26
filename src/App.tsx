import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import QuizDashboard from './components/QuizDashboard';

const App: React.FC = () => {
  return (
    <div>
      <QuizDashboard />
    </div>
  );
};

export default App;
