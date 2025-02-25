'use client';

import { useAccount } from '@lifi/wallet-management';
import generateKey from 'src/app/lib/generateKey';
import { useMerklRewardsOnCampaigns } from 'src/hooks/useMerklRewardsOnCampaigns';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { type Quest } from 'src/types/loyaltyPass';

import {
  QuestPageMainBox,
  QuestsContainer,
} from '../QuestPage/QuestPage.style';
import { BackButton } from '../QuestPage/BackButton/BackButton';
import { BerachainMarketsHeader } from '../Berachain/components/BerachainMarkets/BerachainMarketsHeader';
import { Box } from '@mui/material';
import { QuestsOverview } from '../ProfilePage/QuestsOverview/QuestsOverview';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import { CampaignHeader } from './CampaignHeader/CampaignHeader';

interface CampaignPageProps {
  label: string;
  baseUrl?: string;
  activeCampaign?: string;
  path: string;
}

export const CampaignPage = ({
  label,
  activeCampaign,
  path,
}: CampaignPageProps) => {
  //   const attributes = quest?.attributes;
  //   const CTAs = quest?.attributes?.CustomInformation?.['CTA'];
  //   const missionType = quest?.attributes?.CustomInformation?.['missionType'];
  //   const rewardType = attributes?.CustomInformation?.['rewardType'];
  //   const rewardRange = attributes?.CustomInformation?.['rewardRange'];
  //   const rewards = quest.attributes?.CustomInformation?.['rewards'];
  //   const points = quest?.attributes?.Points;

  //   const { account } = useAccount();
  //   const { pastCampaigns } = useMerklRewardsOnCampaigns({
  //     userAddress: account?.address,
  //   });
  //   const { CTAsWithAPYs } = useMissionsAPY(CTAs);

  return (
    <PageContainer className="profile-page">
      <BackButton path={path} title={activeCampaign} />
      <CampaignHeader
        bannerImage={'https://strapi.jumper.exchange/uploads/BG_dbd731b976.png'}
        tokenImage={
          'https://strapi.jumper.exchange/uploads/Np_M0_F_Gcg_EMJCIT_Nnh_M_Fnl5_Ul8_f69135f4bf.avif'
        }
        websiteLink={'https://ecosystem.berachain.com/'}
        Xlink={''}
      />
      <QuestsOverview pastCampaigns={[]} label={label} />
    </PageContainer>
  );
};
