import { useTheme } from '@mui/material/styles';
import { FC, PropsWithChildren, useMemo } from 'react';
import { Carousel } from 'src/components/Carousel/Carousel';
import { RewardsCarouselContainer } from './RewardsCarousel.style';

interface RewardsCarouselProps extends PropsWithChildren {}

export const RewardsCarousel: FC<RewardsCarouselProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <RewardsCarouselContainer>
      <Carousel
        fixedSlideWidth={true}
        sx={{
          '.carousel-swiper': {
            marginTop: 0,
            paddingBottom: 0,
          },
          '.carousel-swiper .swiper-slide': {
            marginRight: '0 !important',
          },
          marginTop: theme.spacing(2),
          [theme.breakpoints.up('md')]: {
            marginTop: 0,
          },
        }}
      >
        {children}
      </Carousel>
    </RewardsCarouselContainer>
  );
};
