'use client';

import Typography from '@mui/material/Typography';
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { Button } from '@/components/core/buttons/Button/Button';
import {
  HorizontalTabs,
  type HorizontalTabItem,
} from 'src/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { Link } from '@/components/Link/Link';
import { AppPaths } from 'src/const/urls';
import { useActivityRewards } from 'src/hooks/achievements/useActivityRewards';
import { useOngoingActivity } from 'src/hooks/achievements/useOngoingActivity';
import { useMissionsInfinite } from 'src/hooks/useMissionsInfinite';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { NoDataPlaceholder } from '../../components/NoDataPlaceholder/NoDataPlaceholder';
import { SectionCarousel } from '../../components/SectionCarousel/SectionCarousel';
import { sectionTabsSx } from '../Section.style';
import { AchievementCardSkeleton } from '../YourAchievementsSection/AchievementCardSkeleton';
import { MissionXpCard } from './MissionXpCard';
import { MissionXpCardSkeleton } from './MissionXpCardSkeleton';
import {
  ActivitySkeletonGrid,
  earnXpCardSx,
  HeaderDivider,
  HeaderGroup,
  HeaderRow,
  HeaderText,
  MissionSkeletonGrid,
  outstandingGoalsSx,
  TabBarRow,
  TabsGroup,
  XpStat,
} from './EarnXpSection.styles';
import { OngoingActivityCard } from './OngoingActivityCard';

enum EarnXpTab {
  Missions = 'missions',
  Activity = 'activity',
}

// Skeleton placeholders shown while the first page of missions loads; matches
// the 3-up carousel layout.
const SKELETON_COUNT = 3;

// Activity skeletons match the 4-up carousel and the four ongoing activity
// categories (swap / earn / bridge / chain).
const ACTIVITY_SKELETON_COUNT = 4;

export const EarnXpSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(EarnXpTab.Missions);
  const { walletAddress } = useContext(ProfileContext);
  const { data, isLoading } = useMissionsInfinite();
  const {
    activities: ongoingActivities,
    outstandingCount,
    earnedXP,
    isLoading: isOngoingLoading,
  } = useOngoingActivity(walletAddress);
  // Settled months provide the category artwork while the running month has
  // no reward entity (and therefore no image) yet.
  const { activities: settledActivities } = useActivityRewards(walletAddress);
  const fallbackImageByType = Object.fromEntries(
    settledActivities
      .filter((pda) => pda.reward.image)
      .map((pda) => [pda.reward.type, pda.reward.image])
      .reverse(),
  );

  const missions = data?.pages.flatMap((page) => page.data) ?? [];

  const tabs: HorizontalTabItem[] = [
    {
      label: t('profile_page.earnXp.tabs.missions'),
      value: EarnXpTab.Missions,
    },
    {
      label: t('profile_page.earnXp.tabs.activity'),
      value: EarnXpTab.Activity,
    },
  ];

  return (
    <SectionCard sx={earnXpCardSx}>
      <HeaderGroup>
        <HeaderRow>
          <HeaderText>
            <Typography variant="titleXSmall" sx={{ color: 'accent1.main' }}>
              {t('profile_page.earnXp.title')}
            </Typography>
            <Typography variant="bodyMediumParagraph" color="textSecondary">
              {t('profile_page.earnXp.description')}
            </Typography>
          </HeaderText>
          <Button component={Link} href={AppPaths.Missions}>
            {t('profile_page.earnXp.openHub')}
          </Button>
        </HeaderRow>
        <HeaderDivider />
      </HeaderGroup>

      <TabsGroup>
        <TabBarRow>
          <HorizontalTabs
            tabs={tabs}
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            size={HorizontalTabSize.MD}
            sx={sectionTabsSx}
            id="earn-xp-tabs"
          />
          {!isOngoingLoading && (
            <XpStat>
              <XPIcon />
              <Typography variant="bodySmall" color="textSecondary">
                <Trans
                  i18nKey="profile_page.earnXp.xpEarnedMessage"
                  values={{ xp: earnedXP }}
                  t={t}
                />
              </Typography>
            </XpStat>
          )}
        </TabBarRow>

        {activeTab === EarnXpTab.Missions ? (
          isLoading ? (
            <MissionSkeletonGrid>
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <MissionXpCardSkeleton key={index} />
              ))}
            </MissionSkeletonGrid>
          ) : missions.length > 0 ? (
            <SectionCarousel maxSlidesPerView={3}>
              {missions.map((mission) => (
                <MissionXpCard key={mission.id} mission={mission} />
              ))}
            </SectionCarousel>
          ) : (
            <NoDataPlaceholder
              heroImage="/mission-empty-hero.png"
              description={t('profile_page.earnXp.noMissions.description')}
              caption={t('profile_page.earnXp.noMissions.caption')}
              ctaText={t('profile_page.earnXp.noMissions.cta')}
              ctaLink={AppPaths.Missions}
            />
          )
        ) : isOngoingLoading ? (
          <ActivitySkeletonGrid>
            {Array.from({ length: ACTIVITY_SKELETON_COUNT }).map((_, index) => (
              <AchievementCardSkeleton key={index} />
            ))}
          </ActivitySkeletonGrid>
        ) : (
          <>
            <SectionCarousel maxSlidesPerView={4}>
              {ongoingActivities.map((activity) => (
                <OngoingActivityCard
                  key={activity.type}
                  activity={activity}
                  fallbackImageUrl={fallbackImageByType[activity.type]}
                />
              ))}
            </SectionCarousel>
            {outstandingCount > 0 && (
              <Typography
                variant="bodySmallParagraph"
                color="textSecondary"
                sx={outstandingGoalsSx}
              >
                <Trans
                  i18nKey="profile_page.earnXp.activity.outstanding"
                  count={outstandingCount}
                  components={{ bold: <b /> }}
                  t={t}
                />
              </Typography>
            )}
          </>
        )}
      </TabsGroup>
    </SectionCard>
  );
};
