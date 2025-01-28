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
        bannerImage={
          'https://strapi.jumper.exchange/uploads/topbanner_a079924a00.jpg'
        }
        tokenImage={
          'https://strapi.jumper.exchange/uploads/lisk_chain_a996787b58.png'
        }
        websiteLink={'https://lisk.com/'}
        Xlink={''}
      />
      <QuestsOverview pastCampaigns={[]} label={label} />
    </PageContainer>
  );
};
