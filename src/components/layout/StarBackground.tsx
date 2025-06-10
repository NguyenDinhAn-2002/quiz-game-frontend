import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
}

const StarBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Generate random stars
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const newStars: Star[] = [];
    
    const numberOfStars = Math.floor((windowWidth * windowHeight) / 10000);
    
    for (let i = 0; i < numberOfStars; i++) {
      newStars.push({
        id: i,
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleDuration: Math.random() * 3 + 2,
      });
    }
    
    setStars(newStars);
    
    // Add resize listener
    const handleResize = () => {
      setStars(prevStars => {
        const newWindowWidth = window.innerWidth;
        const newWindowHeight = window.innerHeight;
        return prevStars.map(star => ({
          ...star,
          x: (star.x / windowWidth) * newWindowWidth,
          y: (star.y / windowHeight) * newWindowHeight,
        }));
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            '--twinkle-duration': `${star.twinkleDuration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default StarBackground;