'use client';

import type { CampaignData } from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import { JUMPER_LOYALTY_PATH } from 'src/const/urls';
import { MerklRewards } from '../ProfilePage/MerklRewards';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import { QuestsOverview } from '../ProfilePage/QuestsOverview/QuestsOverview';
import { BackButton } from '../QuestPage/BackButton/BackButton';
import { CampaignHeader } from './CampaignHeader/CampaignHeader';

interface CampaignPageProps {
  campaign: CampaignData;
}

export const CampaignPage = ({ campaign }: CampaignPageProps) => {
  const { t } = useTranslation();
  return (
    <PageContainer className="profile-page">
      <BackButton
        path={JUMPER_LOYALTY_PATH}
        title={t('navbar.navbarMenu.profile') || 'Profile'}
      />
      {campaign.merkl_rewards && (
        <MerklRewards merkl_rewards={campaign.merkl_rewards} />
      )}
      <CampaignHeader campaign={campaign} />
      {Array.isArray(campaign.quests) && campaign.quests?.length > 0 && (
        <QuestsOverview quests={campaign.quests} label={campaign.Slug} />
      )}
    </PageContainer>
  );
};
