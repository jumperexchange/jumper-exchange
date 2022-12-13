import EvStationIcon from '@mui/icons-material/EvStation';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import {
  NavbarTab,
  NavbarTabs,
  NavbarTabsContainer as NavbarTabsWrapper,
} from './Navbar.styled';
const linkMap = {
  swap: '/swap',
  dashboard: '/dashboard',
  refuel: '/gas',
};

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
    <NavbarTabsWrapper>
      <Box
        sx={{
          borderColor: 'divider',
          width: '100%',
          height: '48px',
          borderBottom: 'unset',
        }}
      >
        <NavbarTabs
          value={!!isMobile ? false : settings.activeTab}
          onChange={handleChange}
          isDarkMode={isDarkMode}
          aria-label="basic tabs example"
          indicatorColor="primary"
        >
          <NavbarTab
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
      </Box>
    </NavbarTabsWrapper>
  );
};

export default NavbarTabsContainer;
