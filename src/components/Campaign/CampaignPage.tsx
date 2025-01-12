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
import { CampaignHeader } from './CampaignHeader/CampaignHeader';
import { PageContainer } from '../ProfilePage/ProfilePage.style';

interface CampaignPageProps {
  quests: any;
  label: string;
  baseUrl?: string;
  activeCampaign?: string;
  path: string;
}

export const CampaignPage = ({
  quests,
  label,
  baseUrl,
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
      <CampaignHeader />
      <QuestsOverview pastCampaigns={[]} label={label} />
    </PageContainer>
  );
};
