'use client';

import { useTranslation } from 'react-i18next';
import { AppPaths } from 'src/const/urls';
import { useActivityRewards } from 'src/hooks/achievements/useActivityRewards';
import { AchievementsTabPanel } from './AchievementsTabPanel';
import { ActivityCard } from './ActivityCard';

interface ActivityTabProps {
  walletAddress?: string;
  isWalletLoading: boolean;
}

export const ActivityTab = ({
  walletAddress,
  isWalletLoading,
}: ActivityTabProps) => {
  const { t } = useTranslation();
  const { activities, isLoading } = useActivityRewards(walletAddress);

  return (
    <AchievementsTabPanel
      items={activities}
      isLoading={isWalletLoading || isLoading}
      emptyState={{
        heroImage: '/activity-empty-hero.png',
        description: t('profile_page.yourAchievements.noActivity.description'),
        caption: t('profile_page.yourAchievements.noActivity.caption'),
        ctaText: t('profile_page.yourAchievements.noActivity.cta'),
        ctaLink: AppPaths.Main,
      }}
      renderItem={(pda) => <ActivityCard key={pda.id} pda={pda} />}
    />
  );
};
