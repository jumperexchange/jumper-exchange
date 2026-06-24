'use client';

import { useTranslation } from 'react-i18next';
import { AppPaths } from 'src/const/urls';
import { useCompletedMissions } from 'src/hooks/quests/useCompletedMissions';
import { AchievementsTabPanel } from './AchievementsTabPanel';
import { CompletedMissionCard } from './CompletedMissionCard';

interface MissionsTabProps {
  walletAddress?: string;
  isWalletLoading: boolean;
}

export const MissionsTab = ({
  walletAddress,
  isWalletLoading,
}: MissionsTabProps) => {
  const { t } = useTranslation();
  const { completedMissions, isLoading } = useCompletedMissions(walletAddress);

  return (
    <AchievementsTabPanel
      items={completedMissions}
      isLoading={isWalletLoading || isLoading}
      emptyState={{
        heroImage: '/mission-empty-hero.png',
        description: t('profile_page.yourAchievements.noMissions.description'),
        caption: t('profile_page.yourAchievements.noMissions.caption'),
        ctaText: t('profile_page.yourAchievements.noMissions.cta'),
        ctaLink: AppPaths.Missions,
      }}
      renderItem={(mission) => (
        <CompletedMissionCard
          key={mission.quest.documentId}
          mission={mission}
        />
      )}
    />
  );
};
