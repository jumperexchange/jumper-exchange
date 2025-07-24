'use client';

import { FC, PropsWithChildren } from 'react';
import { AnimatedPagination } from 'src/components/Carousel/AnimatedPagination';
import { Carousel } from 'src/components/Carousel/Carousel';
import { FloatingNavigation } from 'src/components/Carousel/FloatingNavigation';
import { CarouselOuterContainer } from './BannerCarousel.style';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';

export const CarouselShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SectionCard>
      <CarouselOuterContainer
        sx={{ paddingX: 3, marginX: -3 }}
        hasPagination={!!Array.isArray(children) && children.length > 1}
      >
        <Carousel
          CarouselNavigation={FloatingNavigation}
          CarouselPagination={AnimatedPagination}
          shouldLoop={false}
          autoplayOptions={{
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
      </CarouselOuterContainer>
    </SectionCard>
  );
};
