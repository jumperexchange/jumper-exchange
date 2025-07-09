'use client';

import { useTheme } from '@mui/material/styles';
import { Tabs, type TabProps } from 'src/components/Tabs';
import { FC, ReactNode, useState } from 'react';
import { ZapTabsBox } from './ZapWidgetTabs.style';
import Box from '@mui/material/Box';

interface ZapWidgetTabsProps {
  renderChildren: (activeTab: number) => ReactNode;
}

export const ZapWidgetTabs: FC<ZapWidgetTabsProps> = ({ renderChildren }) => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const containerStyles = {
    display: 'flex',
    width: 'auto',
    marginX: 2,
    borderRadius: '24px',
    div: {
      height: 38,
    },
    '.MuiTabs-indicator': {
      height: 38,
      zIndex: -1,
      borderRadius: '18px',
    },
  };

  const tabStyles = {
    height: 38,
    margin: theme.spacing(0.75),
    minWidth: 'unset',
    borderRadius: '18px',
    maxWidth: 'unset',
  };

  const tabs: TabProps[] = [
    { label: 'Deposit', value: 0, onClick: () => setTab(0) },
    { label: 'Withdraw', value: 1, onClick: () => setTab(1) },
  ];

  return (
    <ZapTabsBox>
      <Tabs
        data={tabs}
        value={tab}
        ariaLabel="zap-switch-tabs"
        containerStyles={containerStyles}
        tabStyles={tabStyles}
      />
      <Box
        sx={{
          marginTop: theme.spacing(1.5),
        }}
      >
        {renderChildren(tab)}
      </Box>
    </ZapTabsBox>
  );
};
