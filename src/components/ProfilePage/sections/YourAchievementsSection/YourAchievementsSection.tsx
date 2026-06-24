'use client';

import Typography from '@mui/material/Typography';
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  HorizontalTabs,
  type HorizontalTabItem,
} from 'src/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { sectionTabsSx } from '../Section.style';
import { ActivityTab } from './ActivityTab';
import { MissionsTab } from './MissionsTab';
import {
  SectionHeader,
  TabbedContent,
  yourAchievementsCardSx,
} from './YourAchievementsSection.styles';

enum YourAchievementsTab {
  Missions = 'missions',
  Activity = 'activity',
}

export const YourAchievementsSection = () => {
  const { t } = useTranslation();
  const { walletAddress, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  const [activeTab, setActiveTab] = useState<string>(
    YourAchievementsTab.Missions,
  );

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

  return (
    <SectionCard sx={yourAchievementsCardSx}>
      <SectionHeader>
        <Typography variant="titleXSmall" sx={{ color: 'accent1.main' }}>
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
          onChange={(_, value) => setActiveTab(value)}
          size={HorizontalTabSize.MD}
          sx={sectionTabsSx}
          id="your-achievements-tabs"
        />

        {activeTab === YourAchievementsTab.Missions ? (
          <MissionsTab
            walletAddress={walletAddress}
            isWalletLoading={isWalletLoading}
          />
        ) : (
          <ActivityTab
            walletAddress={walletAddress}
            isWalletLoading={isWalletLoading}
          />
        )}
      </TabbedContent>
    </SectionCard>
  );
};
