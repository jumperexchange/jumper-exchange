import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { BerachainStarsContainer } from './BerachainStars.style';

interface Star {
  id: number;
  top: string;
  left: string;
  opacity: number;
  duration: number;
}

export const BerachainStars: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const createStars = (count: number) => {
      const newStars = Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${100 * Math.random()}%`,
        left: `${100 * Math.random()}%`,
        opacity: Math.random(),
        duration: Math.random() * 0.5 + 0.5,
      }));
      setStars(newStars);
    };

    createStars(200);
  }, []);

  return (
    <BerachainStarsContainer id="stars">
      {stars.map((star) => (
        <motion.figure
          key={star.id}
          className="star"
          style={{ top: star.top, left: star.left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: star.opacity }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />
      ))}
    </BerachainStarsContainer>
  );
};
