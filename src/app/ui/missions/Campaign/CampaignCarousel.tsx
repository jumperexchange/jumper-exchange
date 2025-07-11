'use client';

import Box from '@mui/material/Box';
import { FC, PropsWithChildren } from 'react';
import { AnimatedPagination } from 'src/components/Carousel/AnimatedPagination';
import { Carousel } from 'src/components/Carousel/Carousel';
import { CampaignData } from 'src/types/strapi';
import { FloatingNavigation } from 'src/components/Carousel/FloatingNavigation';
import { CampaignCarouselContainer } from './Campaign.style';

interface CampaignCarouselProps extends PropsWithChildren {
  campaigns?: CampaignData[];
}

export const CampaignCarousel: FC<CampaignCarouselProps> = ({ children }) => {
  return (
    <CampaignCarouselContainer>
      <Box sx={{ position: 'relative', paddingX: 3 }}>
        <Carousel
          CarouselNavigation={FloatingNavigation}
          CarouselPagination={AnimatedPagination}
          autoplay={{
            delay: 5000,
          }}
          sx={{
            marginBottom: 1,
            '& .swiper': {
              marginTop: 0,
            },
          }}
        >
          {children}
        </Carousel>
      </Box>
    </CampaignCarouselContainer>
  );
};
