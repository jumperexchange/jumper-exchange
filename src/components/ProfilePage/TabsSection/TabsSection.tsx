'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { useTranslation } from 'react-i18next';
import { FC, ReactNode, useMemo } from 'react';
import { HorizontalTabs } from 'src/components/HorizontalTabs/HorizontalTabs';
import { AvailableTabs } from './constants';
import Box from '@mui/material/Box';

interface TabsSectionProps {
  children: (activeTab: string) => ReactNode;
}

export const TabsSection: FC<TabsSectionProps> = ({ children }) => {
  const { t } = useTranslation();
  const tabs = useMemo(
    () => [
      {
        label: t('profile_page.achievements'),
        value: AvailableTabs.Achievements,
      },
      {
        label: t('profile_page.perks'),
        value: AvailableTabs.Perks,
      },
    ],
    [t],
  );

  return (
    <SectionCard sx={{ minHeight: '540px' }}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(4),
        })}
      >
        <HorizontalTabs
          tabs={tabs}
          renderContent={children}
          sx={{ width: 'fit-content', background: 'transparent', p: 0 }}
        />
      </Box>
    </SectionCard>
  );
};
