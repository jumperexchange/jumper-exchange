import { useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { useNavbarTabs } from '../../const/useNavbarTabs';
import { useActiveTabStore } from '../../stores';
import { Tabs } from '../Tabs';

export const NavbarTabs = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const navbarTabs = useNavbarTabs();

  return (
    <Tabs
      data={navbarTabs}
      value={isDesktop ? activeTab : false}
      onChange={handleChange}
      ariaLabel="tabs"
      indicatorColor="primary"
    />
  );
};
