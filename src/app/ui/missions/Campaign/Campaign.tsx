import {
  CampaignContainer,
  CampaignContentContainer,
  CampaignImage,
  CampaignImageContainer,
} from './Campaign.style';
import { FC, PropsWithChildren } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IMAGE_SIZES } from './constants';

interface CampaignProps extends PropsWithChildren {
  imageSrc: string;
  alt: string;
}

export const Campaign: FC<CampaignProps> = ({ imageSrc, alt, children }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <CampaignContainer>
      <CampaignImageContainer>
        <CampaignImage
          alt={alt}
          height={
            isMobile ? IMAGE_SIZES.MOBILE.HEIGHT : IMAGE_SIZES.DESKTOP.HEIGHT
          }
          src={imageSrc}
          width={
            isMobile ? IMAGE_SIZES.MOBILE.WIDTH : IMAGE_SIZES.DESKTOP.WIDTH
          }
          isImageLoading={false}
        />
      </CampaignImageContainer>
      {children && (
        <CampaignContentContainer>{children}</CampaignContentContainer>
      )}
    </CampaignContainer>
  );
};
