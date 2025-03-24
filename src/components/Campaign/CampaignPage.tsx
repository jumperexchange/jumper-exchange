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

    // const { account } = useAccount();
    // const { pastCampaigns } = useMerklRewardsOnCampaigns({
    //   userAddress: account?.address,
    // });

  return (
    <PageContainer className="profile-page">
      <BackButton path={path} title={activeCampaign} />
      <CampaignHeader
        bannerImage={'https://strapi.jumper.exchange/uploads/BG_dbd731b976.png'}
        tokenImage={
          'https://strapi.jumper.exchange/uploads/Np_M0_F_Gcg_EMJCIT_Nnh_M_Fnl5_Ul8_f69135f4bf.avif'
        }
        websiteLink={
          'https://lifi.notion.site/Jumper-x-Berachain-Campaign-rules-1a5f0ff14ac7806dbb93c58165d9252e'
        }
        Xlink={''}
      />
      <QuestsOverview pastCampaigns={[]} label={label} />
    </PageContainer>
  );
};
