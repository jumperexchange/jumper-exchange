import useMediaQuery from '@mui/material/useMediaQuery';
import { FC, PropsWithChildren, useState } from 'react';
import {
  CampaignHeroCardContainer,
  CampaignHeroCardImage,
  CampaignHeroCardOverlay,
  CampaignHeroCardImageWrapper,
  CampaignHeroCardContentContainer,
  CampaignHeroCardDescription,
  CampaignHeroCardTitle,
} from './CampaignHero.style';
import { IMAGE_SIZES } from './constants';
import { CampaignHeroImageSkeleton } from './CampaignHeroImageSkeleton';

interface CampaignHeroCardProps extends PropsWithChildren {
  imageSrc: string;
  alt: string;
  title: string;
  description: string;
}

export const CampaignHeroCard: FC<CampaignHeroCardProps> = ({
  title,
  description,
  alt,
  imageSrc,
  children,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  return (
    <CampaignHeroCardContainer>
      <CampaignHeroCardImageWrapper
        sx={{
          height: isMobile
            ? IMAGE_SIZES.MOBILE.HEIGHT
            : IMAGE_SIZES.DESKTOP.HEIGHT,
        }}
      >
        {isLoading && <CampaignHeroImageSkeleton />}
        <CampaignHeroCardImage
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
        <CampaignHeroCardOverlay>{children}</CampaignHeroCardOverlay>
      </CampaignHeroCardImageWrapper>
      <CampaignHeroCardContentContainer>
        <CampaignHeroCardTitle variant="titleMedium">
          {title}
        </CampaignHeroCardTitle>
        <CampaignHeroCardDescription variant="bodyLarge">
          {description}
        </CampaignHeroCardDescription>
      </CampaignHeroCardContentContainer>
    </CampaignHeroCardContainer>
  );
};
