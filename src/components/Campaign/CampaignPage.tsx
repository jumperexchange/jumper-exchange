'use client';

import type { CampaignData } from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import { JUMPER_PROFILE_PATH } from 'src/const/urls';
import { QuestDataExtended } from 'src/types/merkl';
import { MerklRewards } from '../ProfilePage/MerklRewards';
import { PageContainer } from '../ProfilePage/ProfilePage.style';
import { QuestsOverview } from '../ProfilePage/QuestsOverview/QuestsOverview';
import { BackButton } from '../QuestPage/BackButton/BackButton';
import { CampaignHeader } from './CampaignHeader/CampaignHeader';

interface CampaignPageProps {
  campaign: CampaignData;
  quests: QuestDataExtended[];
}

export const CampaignPage = ({ campaign, quests }: CampaignPageProps) => {
  const { t } = useTranslation();
  return (
    <PageContainer className="profile-page">
      <BackButton
        path={JUMPER_PROFILE_PATH}
        title={t('navbar.navbarMenu.profile') || 'Profile'}
      />
      {campaign.merkl_rewards && (
        <MerklRewards merklRewards={campaign.merkl_rewards} />
      )}
      <CampaignHeader campaign={campaign} />
      {Array.isArray(campaign.quests) && campaign.quests?.length > 0 && (
        <QuestsOverview quests={quests} label={campaign.Slug} />
      )}
    </PageContainer>
  );
};
