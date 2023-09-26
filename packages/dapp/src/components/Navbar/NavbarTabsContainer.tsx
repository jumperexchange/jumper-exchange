import CreditCardIcon from '@mui/icons-material/CreditCard';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameters,
} from '../../const';
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
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const { trackEvent } = useUserTracking();
  const isDarkMode = theme.palette.mode === 'dark';
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClickTab =
    (tab: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      window.history.replaceState(null, document.title, `/${tab}`);
      trackEvent({
        category: TrackingCategory.Navigation,
        action: TrackingAction.SwitchTab,
        label: `switch_tab_to_${tab}`,
        data: { [TrackingEventParameters.Tab]: tab },
        disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
      });
    };

  return (
    <NavbarTabs
      value={isDesktop ? activeTab : false}
      onChange={handleChange}
      isDarkMode={isDarkMode}
      aria-label="tabs"
      indicatorColor="primary"
    >
      <NavbarTab
        onClick={handleClickTab('exchange')}
        icon={
          <SwapHorizIcon
            sx={{
              marginRight: '6px',
              marginBottom: '0px !important',
              color: isDarkMode
                ? theme.palette.white.main
                : theme.palette.black.main,
            }}
          />
        }
        label={t('navbar.links.exchange')}
        {...a11yProps(0)}
      />
      <NavbarTab
        onClick={handleClickTab('refuel')}
        label={t('navbar.links.refuel')}
        icon={
          <EvStationOutlinedIcon
            sx={{
              marginRight: '6px',
              marginBottom: '0px !important',
              color: isDarkMode
                ? theme.palette.white.main
                : theme.palette.black.main,
            }}
          />
        }
        {...a11yProps(1)}
      />
      {import.meta.env.VITE_ONRAMPER_ENABLED ? (
        <NavbarTab
          onClick={handleClickTab('buy')}
          label={t('navbar.links.buy')}
          icon={
            <CreditCardIcon
              sx={{
                marginRight: '6px',
                marginBottom: '0px !important',
                color: isDarkMode
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
