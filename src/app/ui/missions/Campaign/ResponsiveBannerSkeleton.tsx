'use client';

import useMediaQuery from '@mui/material/useMediaQuery';
import { CarouselSkeletonBox } from './BannerCarousel.style';
import { IMAGE_SIZES } from './constants';

export const ResponsiveBannerSkeleton = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const height = isMobile
    ? IMAGE_SIZES.MOBILE.HEIGHT
    : IMAGE_SIZES.DESKTOP.HEIGHT;

  return (
    <CarouselSkeletonBox
      variant="rectangular"
      animation="wave"
      sx={{ height, width: '100%' }}
    />
  );
};
