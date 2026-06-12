'use client';

import Typography from '@mui/material/Typography';
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@/components/core/buttons/Button/Button';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { MissionCard } from 'src/components/Campaign/MissionsSection/MissionCard';
import { EntityCard } from 'src/components/Cards/EntityCard/EntityCard';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  HorizontalTabs,
  type HorizontalTabItem,
} from 'src/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { useActivityRewards } from 'src/hooks/achievements/useActivityRewards';
import { useOngoingActivity } from 'src/hooks/achievements/useOngoingActivity';
import { useMissionsInfinite } from 'src/hooks/useMissionsInfinite';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { SectionCarousel } from '../../components/SectionCarousel/SectionCarousel';
import { sectionTabsSx } from '../Section.style';
import {
  earnXpCardSx,
  HeaderDivider,
  HeaderGroup,
  HeaderRow,
  HeaderText,
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

// Skeleton placeholders shown while the first page of missions loads.
const SKELETON_COUNT = 2;

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
            <Typography
              variant="urbanistTitleXSmall"
              sx={{ color: 'accent1.main' }}
            >
              {t('profile_page.earnXp.title')}
            </Typography>
            <Typography variant="bodyMediumParagraph" color="textSecondary">
              {t('profile_page.earnXp.description')}
            </Typography>
          </HeaderText>
          {/* TODO: wire to the Mission hub once the route exists. */}
          <Button>{t('profile_page.earnXp.openHub')}</Button>
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
                <Typography component="span" variant="bodySmallStrong">
                  {t('profile_page.earnXp.xpAmount', { xp: earnedXP })}
                </Typography>{' '}
                {t('profile_page.earnXp.xpEarned')}
              </Typography>
            </XpStat>
          )}
        </TabBarRow>

        {activeTab === EarnXpTab.Missions ? (
          (isLoading || missions.length > 0) && (
            <SectionCarousel>
              {isLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                    <EntityCard
                      key={index}
                      variant="compact"
                      isLoading
                      fullWidth
                    />
                  ))
                : missions.map((mission) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))}
            </SectionCarousel>
          )
        ) : isOngoingLoading ? (
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={(theme) => ({ width: '100%', height: theme.spacing(36) })}
          />
        ) : (
          <>
            <SectionCarousel desktopSlidesPerView={4}>
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
