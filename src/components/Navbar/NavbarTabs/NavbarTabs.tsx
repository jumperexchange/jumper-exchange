import { useMediaQuery } from '@mui/material';
import type { Breakpoint, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Tabs } from 'src/components';
import { useActiveTabStore } from 'src/stores';
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
    display: 'none',
    minWidth: 416,
    borderRadius: 28,
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
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
  };

  return (
    <Tabs
      data={navbarTabs}
      value={isDesktop ? activeTab : false}
      onChange={handleChange}
      ariaLabel="navbar-tabs"
      containerStyles={containerStyles}
      tabStyles={tabStyles}
    />
  );
};
