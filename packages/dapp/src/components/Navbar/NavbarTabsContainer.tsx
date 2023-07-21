import CreditCardIcon from '@mui/icons-material/CreditCard';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { TrackingActions, TrackingCategories } from '../../const';
import { useUserTracking } from '../../hooks';
import { useActiveTabStore } from '../../stores';
import { EventTrackingTool } from '../../types';
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
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const { trackEvent } = useUserTracking();
  const isDarkMode = theme.palette.mode === 'dark';
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <NavbarTabs
      value={!!isDesktop ? activeTab : false}
      onChange={handleChange}
      isDarkMode={isDarkMode}
      aria-label="tabs"
      indicatorColor="primary"
    >
      <NavbarTab
        onClick={() => {
          window.history.replaceState(null, document.title, '/exchange');
          trackEvent({
            category: TrackingCategories.Navigation,
            action: TrackingActions.SwitchTab,
            label: 'exchange',
            data: { tab: 'exchange' },
            disableTrackingTool: [EventTrackingTool.ARCx],
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
        label={translate(`${i18Path}links.exchange`)}
        {...a11yProps(0)}
      />
      <NavbarTab
        onClick={() => {
          window.history.replaceState(null, document.title, '/gas');
          trackEvent({
            category: TrackingCategories.Navigation,
            action: TrackingActions.SwitchTab,
            label: 'gas',
            data: { tab: 'gas' },
            disableTrackingTool: [EventTrackingTool.ARCx],
          });
        }}
        label={translate(`${i18Path}links.refuel`)}
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
      {import.meta.env.VITE_ONRAMPER_ENABLED ? (
        <NavbarTab
          onClick={() => {
            window.history.replaceState(null, document.title, '/buy');
            trackEvent({
              category: TrackingCategories.Navigation,
              action: TrackingActions.SwitchTab,
              label: 'gas',
              data: { tab: 'gas' },
              disableTrackingTool: [EventTrackingTool.ARCx],
            });
          }}
          label={translate(`${i18Path}links.buy`)}
          icon={
            <CreditCardIcon
              sx={{
                marginRight: '6px',
                marginBottom: '0px !important',
                color: !!isDarkMode
                  ? theme.palette.white.main
                  : theme.palette.black.main,
              }}
            />
          }
          {...a11yProps(2)}
        />
      ) : null}
    </NavbarTabs>
  );
};

export default NavbarTabsContainer;
