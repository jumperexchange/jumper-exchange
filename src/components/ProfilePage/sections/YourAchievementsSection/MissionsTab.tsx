'use client';

import { useTranslation } from 'react-i18next';
import { AppPaths } from 'src/const/urls';
import { useCompletedCredentials } from '@/hooks/achievements/useCompletedCredentials';
import { AchievementsTabPanel } from './AchievementsTabPanel';
import { ActivityCard } from './ActivityCard';

interface MissionsTabProps {
  walletAddress?: string;
  isWalletLoading: boolean;
}

export const MissionsTab = ({
  walletAddress,
  isWalletLoading,
}: MissionsTabProps) => {
  const { t } = useTranslation();
  const { credentials, isLoading } = useCompletedCredentials(walletAddress);

  return (
    <AchievementsTabPanel
      items={credentials}
      isLoading={isWalletLoading || isLoading}
      emptyState={{
        heroImage: '/mission-empty-hero.png',
        description: t('profile_page.yourAchievements.noMissions.description'),
        caption: t('profile_page.yourAchievements.noMissions.caption'),
        ctaText: t('profile_page.yourAchievements.noMissions.cta'),
        ctaLink: AppPaths.Missions,
      }}
      renderItem={(credential) => (
        <ActivityCard key={credential.id} pda={credential} />
      )}
    />
  );
};
