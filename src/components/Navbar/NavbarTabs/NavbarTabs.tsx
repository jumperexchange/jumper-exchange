import { useMediaQuery } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Tabs } from 'src/components';
import { useActiveTabStore } from 'src/stores';
import { useNavbarTabs } from '.';

export const NavbarTabs = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const navbarTabs = useNavbarTabs();

  const containerStyles = {
    display: 'none',
    minWidth: 392,
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
