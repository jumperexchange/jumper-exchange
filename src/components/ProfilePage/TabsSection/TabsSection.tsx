'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { useTranslation } from 'react-i18next';
import { FC, ReactNode, useMemo } from 'react';
import { HorizontalTabs } from 'src/components/HorizontalTabs/HorizontalTabs';
import { AvailableTabs } from './constants';
import Box from '@mui/material/Box';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';

interface TabsSectionProps {
  children: (activeTab: string) => ReactNode;
}

export const TabsSection: FC<TabsSectionProps> = ({ children }) => {
  const { t } = useTranslation();
  const tabs = useMemo(
    () => [
      {
        label: t('profile_page.perks'),
        value: AvailableTabs.Perks,
      },
      {
        label: t('profile_page.achievements'),
        value: AvailableTabs.Achievements,
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
          sx={(theme) => ({
            width: 'fit-content',
            background: 'transparent',
            p: 0,
            '& button:not(.Mui-selected)': {
              color: `${(theme.vars || theme).palette.text.secondary} !important`,
            },
          })}
          size={HorizontalTabSize.MD}
        />
      </Box>
    </SectionCard>
  );
};
