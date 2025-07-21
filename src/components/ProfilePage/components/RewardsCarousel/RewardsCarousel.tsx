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
        shouldAutoplay={false}
        sx={{
          '.carousel-swiper.swiper': {
            marginTop: `${theme.spacing(-2)} !important`,
            marginBottom: `${theme.spacing(-2)} !important`,
            marginLeft: `${theme.spacing(-0.5)} !important`,
            paddingBottom: `${theme.spacing(2)} !important`,
            paddingTop: `${theme.spacing(2)} !important`,
            paddingLeft: `${theme.spacing(0.5)} !important`,
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
