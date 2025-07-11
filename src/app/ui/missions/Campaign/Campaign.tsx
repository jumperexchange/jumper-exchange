import {
  CampaignContainer,
  CampaignContentContainer,
  CampaignImage,
  CampaignImageContainer,
} from './Campaign.style';
import { FC, PropsWithChildren } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

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
          height={isMobile ? 320 : 470}
          src={imageSrc}
          width={isMobile ? 704 : 1032}
          isImageLoading={false}
        />
      </CampaignImageContainer>
      {children && (
        <CampaignContentContainer>{children}</CampaignContentContainer>
      )}
    </CampaignContainer>
  );
};
