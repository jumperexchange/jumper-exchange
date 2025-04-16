'use client';

import type { CampaignData } from '@/types/strapi';
import { MerklRewards } from '../ProfilePage/MerklRewards';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import { QuestsOverview } from '../ProfilePage/QuestsOverview/QuestsOverview';
import { BackButton } from '../QuestPage/BackButton/BackButton';
import { CampaignHeader } from './CampaignHeader/CampaignHeader';

interface CampaignPageProps {
  campaign: CampaignData;
  path: string;
}

export const CampaignPage = ({ campaign, path }: CampaignPageProps) => {
  return (
    <PageContainer className="profile-page">
      <BackButton path={path} title={campaign.Title} />
      <MerklRewards campaign={campaign} />
      <CampaignHeader campaign={campaign} />
      <QuestsOverview
        quests={campaign.quests}
        pastCampaigns={[]}
        label={campaign.Slug}
      />
    </PageContainer>
  );
};
