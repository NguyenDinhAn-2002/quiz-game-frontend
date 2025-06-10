import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import StarBackground from './StarBackground';


const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-space text-space-text flex flex-col">
      <StarBackground />
      <Navbar />
      <main className="flex-1 pt-16 pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;