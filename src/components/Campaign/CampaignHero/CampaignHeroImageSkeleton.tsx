'use client';

import useMediaQuery from '@mui/material/useMediaQuery';
import { BaseSkeletonBox } from './CampaignHero.style';
import { IMAGE_SIZES } from './constants';

export const CampaignHeroImageSkeleton = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const height = isMobile
    ? IMAGE_SIZES.MOBILE.HEIGHT
    : IMAGE_SIZES.DESKTOP.HEIGHT;

  return (
    <BaseSkeletonBox
      variant="rectangular"
      animation="wave"
      sx={{ height, width: '100%' }}
    />
  );
};
