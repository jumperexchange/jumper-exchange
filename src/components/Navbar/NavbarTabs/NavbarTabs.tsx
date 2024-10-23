'use client';
import { Tabs } from '@/components/Tabs';
import { useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { alpha, useTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { JUMPER_WASH_PATH } from 'src/const/urls';
import { WashTabsMap } from 'src/wash/const/washtTabsMap';
import { useActiveWashTabStore } from 'src/wash/stores/activeWashTab';
import { useNavbarTabs } from '.';

export const NavbarTabs = () => {
  const theme = useTheme();
  const { activeWashTab, setActiveWashTab } = useActiveWashTabStore();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const pathname = usePathname();
  const isWashPage = pathname?.includes(JUMPER_WASH_PATH);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveWashTab(newValue);
  };
  const navbarTabs = useNavbarTabs();

  useEffect(() => {
    const getActiveWashTab = () => {
      if (pathname.includes(WashTabsMap.WashAbout.destination)) {
        console.log('WASHABOUT Setter');
        setActiveWashTab(WashTabsMap.WashAbout.index);
      } else if (pathname.includes(WashTabsMap.WashCollection.destination)) {
        console.log('WASHCOLLECTION Setter');
        setActiveWashTab(WashTabsMap.WashCollection.index);
      } else if (pathname.includes(WashTabsMap.WashNFT.destination)) {
        console.log('WASHNFT Setter');
        setActiveWashTab(WashTabsMap.WashNFT.index);
      }
    };
    getActiveWashTab();
  }, [pathname, setActiveWashTab]);

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
      value={!isDesktop && !isWashPage ? false : activeWashTab}
      onChange={handleChange}
      ariaLabel="navbar-tabs"
      containerStyles={containerStyles}
      tabStyles={tabStyles}
    />
  );
};
