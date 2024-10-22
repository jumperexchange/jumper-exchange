'use client';
import { Tabs } from '@/components/Tabs';
import { useActiveTabStore } from '@/stores/activeTab';
import { useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavbarTabs } from '.';

export const NavbarTabs = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const navbarTabs = useNavbarTabs();

  const containerStyles = {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      minWidth: 416,
      borderRadius: 28,
      backgroundColor: '#390083', // wash color
      display: 'flex',
      '.MuiTabs-indicator': {
        backgroundColor: alpha('#5500bf', 0.4),
      },
    },
    div: {
      height: 56,
    },
    '.MuiTabs-indicator': {
      height: 48,
      zIndex: -1,
      borderRadius: 24,
    },
  };

  const tabStyles = {
    height: 48,
    width: 142,
    borderRadius: '24px',
    '&.Mui-selected': {
      backgroundColor: '#5500bf',
    },
    ':hover': {
      backgroundColor: alpha('#5500bf', 0.4),
    },
  };

  return (
    <Tabs
      data={navbarTabs}
      value={!isDesktop ? false : activeTab}
      onChange={handleChange}
      ariaLabel="navbar-tabs"
      containerStyles={containerStyles}
      tabStyles={tabStyles}
    />
  );
};
