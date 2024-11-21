import { gsap } from 'gsap';
import React, { useCallback, useEffect, useRef } from 'react';
import { BerachainStarsContainer } from './BerachainStars.style';

export const BerachainStars: React.FC = () => {
  const starsContainerRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<Element[]>([]);

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

  const animateStar = useCallback((star: Element) => {
    gsap.to(star, {
      duration: Math.random() * 0.5 + 0.5,
      opacity: Math.random(),
      onComplete: () => animateStar(star),
    });
  }, []);

  useEffect(() => {
    if (starsContainerRef.current) {
      createStars(200);
      starsRef.current.forEach(animateStar);
    }

    return () => {
      // Cleanup animation on component unmount
      starsRef.current.forEach((star) => gsap.killTweensOf(star));
    };
  }, [createStars, animateStar]);

  return (
    <BerachainStarsContainer ref={starsContainerRef} id="stars">
      {/* Remove the "BerachainStars" text */}
    </BerachainStarsContainer>
  );
};
