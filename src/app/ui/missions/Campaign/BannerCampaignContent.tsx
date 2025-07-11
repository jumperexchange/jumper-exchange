'use client';

import { FC, PropsWithChildren, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  BannerSlideContainer,
  BannerContentOverlay,
  BannerImage,
  BannerImageWrapper,
} from './BannerCarousel.style';
import { IMAGE_SIZES } from './constants';
import { ResponsiveBannerSkeleton } from './ResponsiveBannerSkeleton';

interface BannerCampaignContentProps extends PropsWithChildren {
  imageSrc: string;
  alt: string;
  onClick?: () => void;
}

export const BannerCampaignContent: FC<BannerCampaignContentProps> = ({
  imageSrc,
  alt,
  onClick,
  children,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BannerSlideContainer onClick={onClick}>
      <BannerImageWrapper
        sx={{
          height: isMobile
            ? IMAGE_SIZES.MOBILE.HEIGHT
            : IMAGE_SIZES.DESKTOP.HEIGHT,
        }}
      >
        {isLoading && <ResponsiveBannerSkeleton />}
        <BannerImage
          alt={alt}
          height={
            isMobile ? IMAGE_SIZES.MOBILE.HEIGHT : IMAGE_SIZES.DESKTOP.HEIGHT
          }
          src={imageSrc}
          width={
            isMobile ? IMAGE_SIZES.MOBILE.WIDTH : IMAGE_SIZES.DESKTOP.WIDTH
          }
          isImageLoading={isLoading}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </BannerImageWrapper>
      {children && <BannerContentOverlay>{children}</BannerContentOverlay>}
    </BannerSlideContainer>
  );
};
