'use client';

import type { CampaignData } from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import { MerklRewards } from '../ProfilePage/MerklRewards';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import { QuestsOverview } from '../ProfilePage/QuestsOverview/QuestsOverview';
import { BackButton } from '../QuestPage/BackButton/BackButton';
import { CampaignEndedInfo } from './CampaignEndedInfo/CampaignEndedInfo';
import { CampaignHeader } from './CampaignHeader/CampaignHeader';
interface CampaignPageProps {
  campaign: CampaignData;
  path: string;
}

export const CampaignPage = ({ campaign, path }: CampaignPageProps) => {
  const { t } = useTranslation();
  const currentDate = new Date().toISOString();

  return (
    <PageContainer className="profile-page">
      <BackButton
        path={path}
        title={t('navbar.navbarMenu.profile') || 'Profile'}
      />
      {campaign.EndDate < currentDate && (
        <CampaignEndedInfo endDate={campaign.EndDate} />
      )}
      <MerklRewards campaign={campaign} />
      <CampaignHeader campaign={campaign} />
      {Array.isArray(campaign.quests) && campaign.quests?.length > 0 && (
        <QuestsOverview quests={campaign.quests} label={campaign.Slug} />
      )}
    </PageContainer>
  );
};
