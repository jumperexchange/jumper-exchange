import useId from '@mui/utils/useId';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper/types';

export const useSwiperAutoplayControl = (shouldAutoplay: boolean) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const handleInitSwipper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;

      if (!shouldAutoplay) return;

      swiper.on('autoplayStop', () => {
        setIsAutoplayPaused(true);
      });

      swiper.on('autoplayStart', () => {
        setIsAutoplayPaused(false);
      });

      swiper.on('autoplayPause', () => {
        setIsAutoplayPaused(true);
      });

      swiper.on('autoplayResume', () => {
        setIsAutoplayPaused(false);
      });

      // In non-Chromium browsers changing the slide is making the autoplay to pause so we need to manually re-trigger it
      swiper.on('slideChangeTransitionStart', () => {
        if (swiper.autoplay?.paused) {
          swiper.autoplay.resume();
        }
        setIsAutoplayPaused(false);
      });
    },
    [shouldAutoplay],
  );

  const handlePauseAutoplay = useCallback(() => {
    if (!shouldAutoplay) return;
    const swiper = swiperRef.current;
    if (swiper?.autoplay?.running) {
      swiper.autoplay.pause();
    }
  }, [shouldAutoplay]);

  const handleResumeAutoplay = useCallback(() => {
    if (!shouldAutoplay) return;
    const swiper = swiperRef.current;
    if (swiper?.autoplay?.paused) {
      swiper.autoplay.resume();
    }
  }, [shouldAutoplay]);

  return {
    swiperRef,
    handleInitSwipper,
    handlePauseAutoplay,
    handleResumeAutoplay,
    isAutoplayPaused,
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
