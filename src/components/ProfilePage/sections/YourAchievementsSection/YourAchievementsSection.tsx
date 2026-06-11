'use client';

import Typography from '@mui/material/Typography';
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import Pagination, {
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  HorizontalTabs,
  type HorizontalTabItem,
} from 'src/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';
import { AppPaths } from 'src/const/urls';
import { useActivityRewards } from 'src/hooks/achievements/useActivityRewards';
import { useCompletedMissions } from 'src/hooks/quests/useCompletedMissions';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { NoDataPlaceholder } from '../../components/NoDataPlaceholder/NoDataPlaceholder';
import { sectionTabsSx } from '../Section.style';
import { ActivityCard } from './ActivityCard';
import { CompletedMissionCard } from './CompletedMissionCard';
import {
  AchievementsGrid,
  paginationSx,
  SectionHeader,
  TabbedContent,
  yourAchievementsCardSx,
} from './YourAchievementsSection.styles';

enum YourAchievementsTab {
  Missions = 'missions',
  Activity = 'activity',
}

// 2 rows of 4 cards at the desktop content width.
const PAGE_SIZE = 8;

export const YourAchievementsSection = () => {
  const { t } = useTranslation();
  const { walletAddress, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  const { completedMissions, isLoading: isMissionsLoading } =
    useCompletedMissions(walletAddress);
  const { activities, isLoading: isActivitiesLoading } =
    useActivityRewards(walletAddress);
  const [activeTab, setActiveTab] = useState<string>(
    YourAchievementsTab.Missions,
  );
  const [page, setPage] = useState(0);

  const tabs: HorizontalTabItem[] = [
    {
      label: t('profile_page.yourAchievements.tabs.missions'),
      value: YourAchievementsTab.Missions,
    },
    {
      label: t('profile_page.yourAchievements.tabs.activity'),
      value: YourAchievementsTab.Activity,
    },
  ];

  const isMissionsTab = activeTab === YourAchievementsTab.Missions;
  const itemCount = isMissionsTab
    ? completedMissions.length
    : activities.length;
  const isLoading =
    isWalletLoading ||
    (isMissionsTab ? isMissionsLoading : isActivitiesLoading);
  const pageCount = Math.ceil(itemCount / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;

  const handleTabChange = (_: unknown, value: string) => {
    setActiveTab(value);
    setPage(0);
  };

  return (
    <SectionCard sx={yourAchievementsCardSx}>
      <SectionHeader>
        <Typography
          variant="urbanistTitleXSmall"
          sx={{ color: 'accent1.main' }}
        >
          {t('profile_page.yourAchievements.title')}
        </Typography>
        <Typography variant="bodyMediumParagraph" color="textSecondary">
          <Trans
            i18nKey="profile_page.yourAchievements.description"
            components={{ bold: <b /> }}
            t={t}
          />
        </Typography>
      </SectionHeader>

      <TabbedContent>
        <HorizontalTabs
          tabs={tabs}
          value={activeTab}
          onChange={handleTabChange}
          size={HorizontalTabSize.MD}
          sx={sectionTabsSx}
          id="your-achievements-tabs"
        />

        {isLoading ? (
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={(theme) => ({ width: '100%', height: theme.spacing(36) })}
          />
        ) : itemCount === 0 ? (
          isMissionsTab ? (
            <NoDataPlaceholder
              imageUrl="/missions-empty-state.png"
              description={t(
                'profile_page.yourAchievements.noMissions.description',
              )}
              caption={t('profile_page.yourAchievements.noMissions.caption')}
              ctaText={t('profile_page.yourAchievements.noMissions.cta')}
              ctaLink={AppPaths.Missions}
            />
          ) : (
            <NoDataPlaceholder
              imageUrl="/activity-empty-state.png"
              description={t(
                'profile_page.yourAchievements.noActivity.description',
              )}
              caption={t('profile_page.yourAchievements.noActivity.caption')}
              ctaText={t('profile_page.yourAchievements.noActivity.cta')}
              ctaLink={AppPaths.Main}
            />
          )
        ) : (
          <>
            <AchievementsGrid>
              {isMissionsTab
                ? completedMissions
                    .slice(pageStart, pageEnd)
                    .map((mission) => (
                      <CompletedMissionCard
                        key={mission.quest.documentId}
                        mission={mission}
                      />
                    ))
                : activities
                    .slice(pageStart, pageEnd)
                    .map((pda) => <ActivityCard key={pda.id} pda={pda} />)}
            </AchievementsGrid>
            {pageCount > 1 && (
              <Pagination
                variant={PaginationVariant.AllPages}
                page={page}
                setPage={setPage}
                pagination={{
                  page,
                  pageSize: PAGE_SIZE,
                  pageCount,
                  total: itemCount,
                }}
                sx={paginationSx}
              />
            )}
          </>
        )}
      </TabbedContent>
    </SectionCard>
  );
};
