'use client';
import { useTheme } from '@mui/material/styles';
import { Children, type FC, type PropsWithChildren } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import { RewardsCarouselContainer } from './RewardsCarousel.style';

interface RewardsCarouselProps extends PropsWithChildren {}

export const RewardsCarousel: FC<RewardsCarouselProps> = ({ children }) => {
  const theme = useTheme();

  const slides = Children.toArray(children);

  return (
    <RewardsCarouselContainer
      sx={{
        overflow: 'hidden',
        margin: theme.spacing(2, -2, -2, -2),
        [theme.breakpoints.up('md')]: {
          marginTop: 0,
        },
      }}
    >
      <Swiper
        modules={[FreeMode]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode={{
          enabled: true,
          sticky: true,
          momentumRatio: 0.5,
        }}
        grabCursor
        style={{ overflow: 'visible', padding: theme.spacing(0, 2, 2, 2) }}
      >
        {slides.map((child, index) => (
          <SwiperSlide key={index} style={{ width: 'auto' }}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </RewardsCarouselContainer>
  );
};
