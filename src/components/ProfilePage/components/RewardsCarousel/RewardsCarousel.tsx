'use client';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Children, useEffect, type FC, type PropsWithChildren } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import {
  RewardsCarouselContainer,
  RewardsCarouselNavigationContainer,
} from './RewardsCarousel.style';
import { useRewardsCarouselContext } from './RewardsCarouselContext';
import { RewardsCarouselNavButtons } from './components/RewardsCarouselNavButtons';

export const RewardsCarousel: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { navState, classNames, swiperInstance, handleSwiper } =
    useRewardsCarouselContext();

  const slides = Children.toArray(children);

  useEffect(() => {
    if (!swiperInstance) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    });

    return () => cancelAnimationFrame(raf);
  }, [isMobile, swiperInstance]);

  return (
    <RewardsCarouselContainer>
      <Swiper
        key={isMobile ? 'mobile' : 'desktop'}
        onSwiper={handleSwiper}
        modules={[FreeMode, Navigation]}
        slidesPerView={isMobile ? 1 : 'auto'}
        spaceBetween={16}
        centeredSlides={isMobile}
        centeredSlidesBounds={isMobile}
        freeMode={{ enabled: true, sticky: true, momentumRatio: 0.5 }}
        className="carousel-swiper"
        grabCursor
        style={{
          paddingRight: isMobile ? 0 : theme.spacing(1),
          paddingLeft: isMobile ? 0 : theme.spacing(1),
          paddingBottom: theme.spacing(2),
          marginRight: isMobile ? 0 : theme.spacing(1),
          marginLeft: isMobile ? 0 : theme.spacing(1),
        }}
        navigation={{
          prevEl: `.${classNames.navigationPrev}`,
          nextEl: `.${classNames.navigationNext}`,
        }}
      >
        {slides.map((child, index) => (
          <SwiperSlide key={index} style={{ width: 'auto' }}>
            {child}
          </SwiperSlide>
        ))}
        {!isMobile && (
          <RewardsCarouselNavigationContainer
            data-show-left={!navState.isBeginning}
            data-show-right={!navState.isEnd}
          >
            <RewardsCarouselNavButtons />
          </RewardsCarouselNavigationContainer>
        )}
      </Swiper>
    </RewardsCarouselContainer>
  );
};
