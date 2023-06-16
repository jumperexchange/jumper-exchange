import CreditCardIcon from '@mui/icons-material/CreditCard';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { TrackingActions, TrackingCategories } from '../../const';
import { useUserTracking } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { EventTrackingTools } from '../../types';
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
  const [activeTab, onChangeTab] = useSettingsStore(
    (state) => [state.activeTab, state.onChangeTab],
    shallow,
  );
  const isTablet = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));
  const { trackEvent } = useUserTracking();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onChangeTab(newValue);
  };

  return (
    <NavbarTabs
      value={activeTab}
      onChange={handleChange}
      aria-label="tabs"
      indicatorColor="primary"
    >
      <NavbarTab
        onClick={() => {
          window.history.replaceState(null, document.title, '/swap');
          trackEvent({
            category: TrackingCategories.Navigation,
            action: TrackingActions.SwitchTab,
            label: 'swap',
            data: { tab: 'swap' },
            disableTrackingTool: [EventTrackingTools.arcx],
          });
        }}
        icon={
          <SwapHorizIcon
            sx={{
              marginBottom: '0px !important',
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.white.main
                  : theme.palette.black.main,
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                marginRight: '6px',
              },
            }}
          />
        }
        label={isTablet && translate(`${i18Path}links.swap`)}
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
            disableTrackingTool: [EventTrackingTools.arcx],
          });
        }}
        label={isTablet && translate(`${i18Path}links.refuel`)}
        icon={
          <EvStationOutlinedIcon
            sx={{
              marginBottom: '0px !important',
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.white.main
                  : theme.palette.black.main,
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                marginRight: '6px',
              },
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
              disableTrackingTool: [EventTrackingTools.arcx],
            });
          }}
          label={isTablet && translate(`${i18Path}links.buy`)}
          icon={
            <CreditCardIcon
              sx={{
                marginBottom: '0px !important',
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.white.main
                    : theme.palette.black.main,
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  marginRight: '6px',
                },
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
