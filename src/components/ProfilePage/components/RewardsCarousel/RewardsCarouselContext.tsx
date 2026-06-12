'use client';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useSwiperScopedClassNames } from '@/components/Carousel/hooks';
import type { Swiper as SwiperType } from 'swiper/types';

interface RewardsCarouselContextValue {
  navState: { isBeginning: boolean; isEnd: boolean };
  classNames: ReturnType<typeof useSwiperScopedClassNames>;
  handleSwiper: (swiper: SwiperType) => void;
  swiperInstance: SwiperType | null;
}

const RewardsCarouselContext =
  createContext<RewardsCarouselContextValue | null>(null);

export const useRewardsCarouselContext = () => {
  const ctx = useContext(RewardsCarouselContext);
  if (!ctx) {
    throw new Error('Must be used within RewardsCarouselRoot');
  }
  return ctx;
};

export const RewardsCarouselRoot = ({ children }: { children: ReactNode }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: true });
  const classNames = useSwiperScopedClassNames();

  const handleSwiper = useCallback((swiper: SwiperType) => {
    setSwiperInstance(swiper);
    const update = () =>
      setNavState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
    swiper.on('init', update);
    swiper.on('update', update);
    swiper.on('slideChange', update);
    swiper.on('resize', update);
    update();
  }, []);

  return (
    <RewardsCarouselContext.Provider
      value={{ navState, classNames, handleSwiper, swiperInstance }}
    >
      {children}
    </RewardsCarouselContext.Provider>
  );
};
