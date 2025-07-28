import useId from '@mui/utils/useId';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper/types';

export const useSwiperAutoplayControl = (
  shouldAutoplay: boolean,
  autoplayDelay: number,
) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentTimeLeft, setCurrentTimeLeft] = useState<number>(autoplayDelay);

  const handleInitSwipper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;

      if (!shouldAutoplay) return;

      swiper.on('autoplayTimeLeft', (_, timeLeft) => {
        setCurrentTimeLeft(timeLeft);
      });
    },
    [shouldAutoplay],
  );

  return {
    swiperRef,
    handleInitSwipper,
    currentTimeLeft,
  };
};

export const useSwiperScopedClassNames = () => {
  const swiperId = useId();

  // specify a unique className for each caroussel to avoid triggering non-related carousels
  const classNames = useMemo(
    () => ({
      navigationPrev: `swiper-button-prev-${swiperId}`,
      navigationNext: `swiper-button-next-${swiperId}`,
      pagination: `swiper-pagination-${swiperId}`,
    }),
    [swiperId],
  );

  return classNames;
};
