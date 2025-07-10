import { CampaignData } from 'src/types/strapi';
import {
  CampaignContainer,
  CampaignImage,
  CampaignImageContainer,
} from './Campaign.style';
import { FC } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

interface CampaignProps {
  campaign: CampaignData;
}

export const Campaign: FC<CampaignProps> = ({ campaign }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const apiBaseUrl = getStrapiBaseUrl();

  const missionsTotal = campaign.quests?.length || 0;
  const slug = campaign.Slug || '';
  console.log(campaign);
  return (
    <CampaignContainer>
      <CampaignImageContainer>
        <CampaignImage
          alt={`${campaign.ProfileBannerTitle} banner`}
          height={isMobile ? 320 : 470}
          src={`${apiBaseUrl}${campaign.ProfileBannerImage?.url}`}
          width={isMobile ? 704 : 1032}
          isImageLoading={false}
        />
      </CampaignImageContainer>
    </CampaignContainer>
  );
};
