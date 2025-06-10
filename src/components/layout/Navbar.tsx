import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Volume2, VolumeX, Music, LogOut, LogIn, User } from 'lucide-react';

const Navbar: React.FC = () => {

  const navigate = useNavigate();

 

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space-darker/80 backdrop-blur-md border-b border-space-accent1/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-space-accent1 to-space-accent2 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
            <div className="absolute inset-0 rounded-full pulse-glow"></div>
          </div>
          <span className="text-xl font-bold text-white glow-text space-gradient bg-clip-text text-transparent">Quiz</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Audio Controls */}
       
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/lobby" className="text-space-text hover:text-space-accent1 transition-colors">
              Lobby
            </Link>
            <Link to="/create" className="text-space-text hover:text-space-accent1 transition-colors">
              Create Quiz
            </Link>
          </div>
          
          {/* Auth Buttons */}
         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;