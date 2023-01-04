import EvStationIcon from '@mui/icons-material/EvStation';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { hotjar } from 'react-hotjar';
import { useTranslation } from 'react-i18next';
import { gaEventTrack } from '../../utils/google-analytics';
import { NavbarTab, NavbarTabs } from './Navbar.styled';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NavbarTabsContainer = () => {
  const theme = useTheme();
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';
  const settings = useSettings();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isDarkMode = theme.palette.mode === 'dark';
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    settings.onChangeTab(newValue);
  };

  return (
    <NavbarTabs
      value={!!isMobile ? false : settings.activeTab}
      onChange={handleChange}
      isDarkMode={isDarkMode}
      aria-label="tabs"
      indicatorColor="primary"
    >
      <NavbarTab
        onClick={() => {
          gaEventTrack({
            category: 'navigation',
            action: 'switch tab',
            label: 'swap',
          });
          hotjar.initialized() &&
            hotjar.stateChange('navigation__switch-tab__swap');
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
        label={`${translate(`${i18Path}Links.Swap`)}`}
        {...a11yProps(0)}
      />
      <NavbarTab
        onClick={() => {
          gaEventTrack({
            category: 'navigation',
            action: 'switch tab',
            label: 'gas',
          });
          hotjar.initialized() &&
            hotjar.stateChange('navigation__switch-tab__gas');
        }}
        label={`${translate(`${i18Path}Links.Refuel`)}`}
        icon={
          <EvStationIcon
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
