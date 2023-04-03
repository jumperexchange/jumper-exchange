import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { EventTrackingTools, useUserTracking } from '../../hooks';
import { NavbarTab, NavbarTabs } from './Navbar.style';
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NavbarTabsContainer = () => {
  const theme = useTheme();
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const settings = useSettings();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const { trackEvent } = useUserTracking();
  const isDarkMode = theme.palette.mode === 'dark';
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    settings.onChangeTab(newValue);
  };

  return (
    <NavbarTabs
      value={!!isDesktop ? settings.activeTab : false}
      onChange={handleChange}
      isDarkMode={isDarkMode}
      aria-label="tabs"
      indicatorColor="primary"
    >
      <NavbarTab
        onClick={() => {
          window.history.replaceState(null, document.title, '/swap');
          trackEvent({
            category: 'navigation',
            action: 'switch-tab',
            label: 'swap',
            data: { tab: 'swap' },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
        }}
        icon={
          <SwapHorizIcon
            sx={{
              marginRight: '6px',
              marginBottom: '0px !important',
              color: !!isDarkMode
                ? theme.palette.white.main
                : theme.palette.black.main,
            }}
          />
        }
        label={`${translate(`${i18Path}links.swap`)}`}
        {...a11yProps(0)}
      />
      <NavbarTab
        onClick={() => {
          window.history.replaceState(null, document.title, '/gas');
          trackEvent({
            category: 'navigation',
            action: 'switch-tab',
            label: 'gas',
            data: { tab: 'gas' },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
        }}
        label={`${translate(`${i18Path}links.refuel`)}`}
        icon={
          <EvStationOutlinedIcon
            sx={{
              marginRight: '6px',
              marginBottom: '0px !important',
              color: !!isDarkMode
                ? theme.palette.white.main
                : theme.palette.black.main,
            }}
          />
        }
        {...a11yProps(1)}
      />
    </NavbarTabs>
  );
};

export default NavbarTabsContainer;
