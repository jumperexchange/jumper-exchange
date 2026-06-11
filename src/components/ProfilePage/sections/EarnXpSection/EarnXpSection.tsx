'use client';

import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/core/buttons/Button/Button';
import { MissionCard } from 'src/components/Campaign/MissionsSection/MissionCard';
import { EntityCard } from 'src/components/Cards/EntityCard/EntityCard';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  HorizontalTabs,
  type HorizontalTabItem,
} from 'src/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { useMissionsInfinite } from 'src/hooks/useMissionsInfinite';
import { SectionCarousel } from '../../components/SectionCarousel/SectionCarousel';
import { sectionTabsSx } from '../Section.style';
import {
  ActivityPlaceholder,
  earnXpCardSx,
  HeaderDivider,
  HeaderGroup,
  HeaderRow,
  HeaderText,
  TabBarRow,
  TabsGroup,
  XpStat,
} from './EarnXpSection.styles';

enum EarnXpTab {
  Missions = 'missions',
  Activity = 'activity',
}

// TODO: wire to the real "XP earned this month" value once the endpoint exists.
const PLACEHOLDER_XP_EARNED = 5;
// Skeleton placeholders shown while the first page of missions loads.
const SKELETON_COUNT = 2;

export const EarnXpSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(EarnXpTab.Missions);
  const { data, isLoading } = useMissionsInfinite();

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
          <XpStat>
            <XPIcon />
            <Typography variant="bodySmall" color="textSecondary">
              <Typography component="span" variant="bodySmallStrong">
                {t('profile_page.earnXp.xpAmount', {
                  xp: PLACEHOLDER_XP_EARNED,
                })}
              </Typography>{' '}
              {t('profile_page.earnXp.xpEarned')}
            </Typography>
          </XpStat>
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
        ) : (
          <ActivityPlaceholder>
            <Typography variant="bodyMediumParagraph" color="textSecondary">
              {t('profile_page.earnXp.activityComingSoon')}
            </Typography>
          </ActivityPlaceholder>
        )}
      </TabsGroup>
    </SectionCard>
  );
};
