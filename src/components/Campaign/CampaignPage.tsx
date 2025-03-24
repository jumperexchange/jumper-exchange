'use client';

import { QuestsOverview } from '../ProfilePage/QuestsOverview/QuestsOverview';
import { BackButton } from '../QuestPage/BackButton/BackButton';
import { PageContainer } from '../styles';
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
        websiteLink={
          'https://lifi.notion.site/Jumper-x-Berachain-Campaign-rules-1a5f0ff14ac7806dbb93c58165d9252e'
        }
        Xlink={''}
      />
      <QuestsOverview pastCampaigns={[]} label={label} />
    </PageContainer>
  );
};
