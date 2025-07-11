'use client';

import { CarouselPaginationBase } from './Carousel.types';
import { AnimatedPaginationContainer } from './Carousel.style';

export const AnimatedPagination = ({
  className,
  delay = 5000,
  isPaused,
}: CarouselPaginationBase) => {
  return (
    <AnimatedPaginationContainer
      isPaused={isPaused}
      delay={delay}
      className={`swiper-pagination ${className}`}
    />
  );
};
