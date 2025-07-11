'use client';

import Box from '@mui/material/Box';
import {
  BaseStyledSkeleton,
  CampaignCarouselContainer,
} from './Campaign.style';
import { IMAGE_SIZES } from './constants';
import useMediaQuery from '@mui/material/useMediaQuery';

export const CampaignCarouselSkeleton = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <CampaignCarouselContainer>
      <Box
        sx={{
          position: 'relative',
          paddingX: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <BaseStyledSkeleton
          variant="rectangular"
          animation="wave"
          sx={{
            height: isMobile
              ? IMAGE_SIZES.MOBILE.HEIGHT
              : IMAGE_SIZES.DESKTOP.HEIGHT,
            width: '100%',
          }}
        />
      </Box>
    </CampaignCarouselContainer>
  );
};
