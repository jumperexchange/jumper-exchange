'use client';

import Box from '@mui/material/Box';
import { FC, PropsWithChildren } from 'react';
import { AnimatedPagination } from 'src/components/Carousel/AnimatedPagination';
import { Carousel } from 'src/components/Carousel/Carousel';
import { FloatingNavigation } from 'src/components/Carousel/FloatingNavigation';
import { CarouselOuterContainer } from './BannerCarousel.style';

export const CarouselShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <CarouselOuterContainer>
      <Box sx={{ position: 'relative', paddingX: 3 }}>
        <Carousel
          CarouselNavigation={FloatingNavigation}
          CarouselPagination={AnimatedPagination}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          sx={{
            marginBottom: 1,
            '& .swiper': { marginTop: 0, padding: 0 },
          }}
        >
          {children}
        </Carousel>
      </Box>
    </CarouselOuterContainer>
  );
};
