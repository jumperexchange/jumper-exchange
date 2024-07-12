'use client';
import { Tabs } from '@/components/Tabs';
import { useActiveTabStore } from '@/stores/activeTab';
import { useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavbarTabs } from '.';

interface NavbarTabsProps {
  navbarPageReload?: boolean;
}

export const NavbarTabs = ({ navbarPageReload }: NavbarTabsProps) => {
  const theme = useTheme();
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const navbarTabs = useNavbarTabs({ navbarPageReload });

  const containerStyles = {
    marginLeft: 'calc(-56px - 32px)', // negative margin; width of navbar + spacing
    display: 'none',
    borderRadius: 28,
    padding: 0,
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
    '.MuiTabs-indicator': {
      position: 'absolute',
      top: '4px',
      left: '4px',
      height: '48px',
      width: '48px',
      borderRadius: '28px',
      transform: 'translateY(0) scaleY(0.98)',
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.alphaLight300.main
          : theme.palette.white.main,
      zIndex: '-1',
    },
  };

  const tabStyles = {
    height: 48,
    width: 48,
    padding: 0,
    minWidth: 48,
    margin: 0.5,
    borderRadius: '24px',
    '&.Mui-selected': {
      pointerEvents: 'none',
    },
    ':not(.Mui-selected) > svg': {
      opacity: 0.5,
    },
    '> svg': {
      margin: 0,
    },
  };

  return (
    <Tabs
      data={navbarTabs}
      value={!isDesktop || navbarPageReload ? false : activeTab}
      onChange={handleChange}
      ariaLabel="navbar-tabs"
      containerStyles={containerStyles}
      tabStyles={tabStyles}
      orientation="vertical"
    />
  );
};
