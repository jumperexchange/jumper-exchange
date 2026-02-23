'use client';
import { useTheme } from '@mui/material/styles';
import {
  useCallback,
  Children,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import {
  RewardsCarouselContainer,
  RewardsCarouselNavigationContainer,
} from './RewardsCarousel.style';
import { useSwiperScopedClassNames } from '@/components/Carousel/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';

interface RewardsCarouselProps extends PropsWithChildren {}

const updateNavState = (swiper: SwiperType) => ({
  isBeginning: swiper.isBeginning,
  isEnd: swiper.isEnd,
});

export const RewardsCarousel: FC<RewardsCarouselProps> = ({ children }) => {
  const theme = useTheme();
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: true });

  const slides = Children.toArray(children);
  const classNames = useSwiperScopedClassNames();

  const handleSwiper = useCallback((swiper: SwiperType) => {
    swiper.on('init', () => setNavState(updateNavState(swiper)));
    swiper.on('update', () => setNavState(updateNavState(swiper)));
    swiper.on('slideChange', () => setNavState(updateNavState(swiper)));
    swiper.on('resize', () => setNavState(updateNavState(swiper)));
  }, []);

  return (
    <RewardsCarouselContainer
      sx={{
        overflow: 'hidden',
        margin: theme.spacing(0, -2, -2, -2),
      }}
    >
      <Swiper
        onSwiper={handleSwiper}
        modules={[FreeMode, Navigation]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode={{
          enabled: true,
          sticky: true,
          momentumRatio: 0.5,
        }}
        className="carousel-swiper"
        grabCursor
        style={{
          padding: theme.spacing(0, 1, 2, 1),
          margin: theme.spacing(0, 1),
        }}
        navigation={{
          prevEl: `.${classNames.navigationPrev}`,
          nextEl: `.${classNames.navigationNext}`,
        }}
        hashNavigation={{
          replaceState: true,
        }}
      >
        {slides.map((child, index) => (
          <SwiperSlide key={index} style={{ width: 'auto' }}>
            {child}
          </SwiperSlide>
        ))}
        <RewardsCarouselNavigationContainer
          data-show-left={!navState.isBeginning}
          data-show-right={!navState.isEnd}
        >
          <IconButton
            aria-label="previous"
            className={classNames.navigationPrev}
            sx={{
              visibility: !navState.isBeginning ? 'visible' : 'hidden',
              pointerEvents: !navState.isBeginning ? 'auto' : 'none',
              zIndex: 10,
              height: 'fit-content',
              marginBottom: theme.spacing(1),
            }}
          >
            <ArrowBackIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
          <IconButton
            aria-label="next"
            className={classNames.navigationNext}
            sx={{
              visibility: !navState.isEnd ? 'visible' : 'hidden',
              pointerEvents: !navState.isEnd ? 'auto' : 'none',
              zIndex: 10,
              height: 'fit-content',
              marginBottom: theme.spacing(1),
            }}
          >
            <ArrowForwardIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </RewardsCarouselNavigationContainer>
      </Swiper>
    </RewardsCarouselContainer>
  );
};
