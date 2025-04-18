'use client';

import { MerklRewards } from '../ProfilePage/MerklRewards';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import { QuestsOverview } from '../ProfilePage/QuestsOverview/QuestsOverview';
import { BackButton } from '../QuestPage/BackButton/BackButton';
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
      <MerklRewards />
      <CampaignHeader
        bannerImage={
          'https://strapi.jumper.exchange/uploads/Lisk_Background_e42d7fb465.jpg'
        }
        tokenImage={
          'https://strapi.jumper.exchange/uploads/LISK_logo_2305c31809.jpg'
        }
        websiteLink={
          'https://www.notion.so/lifi/Jumper-x-Lisk-Ecosystem-Campaign-FAQ-1cef0ff14ac780d289e7cd6877bd9136'
        }
        Xlink={''}
      />
      <QuestsOverview pastCampaigns={[]} label={label} />
    </PageContainer>
  );
};
