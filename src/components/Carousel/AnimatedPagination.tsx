'use client';

import { useMemo } from 'react';
import { CarouselPaginationBase } from './Carousel.types';
import { AnimatedPaginationContainer } from './Carousel.style';

export const AnimatedPagination = ({
  className,
  delay = 5000,
  currentTimeLeft,
}: CarouselPaginationBase) => {
  const progress = useMemo(() => {
    const baseProgress = 5; // Start with 5% progress
    const dynamicProgress = currentTimeLeft
      ? ((delay - currentTimeLeft) / delay) * (100 - baseProgress)
      : 0;
    const totalProgress = baseProgress + dynamicProgress;
    return Math.max(0, Math.min(100, totalProgress));
  }, [currentTimeLeft, delay]);

  return (
    <AnimatedPaginationContainer
      className={`swiper-pagination ${className}`}
      progress={progress}
    />
  );
};
