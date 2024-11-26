import { motion } from 'motion/react';
import React, { useCallback, useEffect, useRef } from 'react';
import { BerachainStarsContainer } from './BerachainStars.style';

export const BerachainStars: React.FC = () => {
  const starsContainerRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<HTMLElement[]>([]);

  const createStars = useCallback((count: number) => {
    if (starsContainerRef.current) {
      for (let i = 0; i < count; i++) {
        const tmpStar = document.createElement('figure');
        tmpStar.className = 'star';
        tmpStar.style.top = `${100 * Math.random()}%`;
        tmpStar.style.left = `${100 * Math.random()}%`;
        starsContainerRef.current.appendChild(tmpStar);
        starsRef.current.push(tmpStar);
      }
    }
  }, []);

  useEffect(() => {
    if (starsContainerRef.current) {
      createStars(200);
    }

    // Capture the current stars in a local variable for cleanup
    const currentStars = [...starsRef.current];

    return () => {
      // Use the captured stars for cleanup
      currentStars.forEach((star) => star.remove());
    };
  }, [createStars]);

  return (
    <BerachainStarsContainer ref={starsContainerRef} id="stars">
      {starsRef.current.map((star, index) => (
        <motion.figure
          key={index}
          className="star"
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.random() }}
          transition={{
            duration: Math.random() * 0.5 + 0.5,
            repeat: Infinity,
            repeatType: 'mirror' as const,
          }}
        />
      ))}
    </BerachainStarsContainer>
  );
};
