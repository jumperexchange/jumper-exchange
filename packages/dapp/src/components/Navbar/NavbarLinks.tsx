import EvStationIcon from '@mui/icons-material/EvStation';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTheme } from '@mui/material/styles';
import { useLocales } from '@transferto/shared/src/hooks';
import { useLocation } from 'react-router-dom';
import { useIsDarkMode } from '../../providers/ThemeProvider';

import {
  NavbarLink,
  NavbarLinkContainer,
  NavbarLinkText,
} from './Navbar.styled';
const linkMap = {
  swap: '/swap',
  dashboard: '/dashboard',
  refuel: '/gas',
};

const NavbarLinks = () => {
  const theme = useTheme();
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  const location = useLocation();
  const isDarkMode = useIsDarkMode();

  return (
    <NavbarLinkContainer className="navbar-container">
      <NavbarLink
        active={
          (location.pathname.includes(linkMap.swap) ||
            location.pathname === '/') ??
          true
        }
        href={linkMap.swap}
        hoverBackgroundColor={'#f5b5ff7a'}
      >
        <>
          <SwapHorizIcon
            sx={{
              marginRight: '6px',
              color: !!isDarkMode
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            }}
          />
          <NavbarLinkText>
            <>{translate(`${i18Path}Links.Swap`)}</>
          </NavbarLinkText>
        </>
      </NavbarLink>
      <NavbarLink
        active={location.pathname.includes(linkMap.refuel) ?? true}
        href={linkMap.refuel}
        hoverBackgroundColor={'#f5b5ff7a'}
      >
        <>
          <EvStationIcon
            sx={{
              marginRight: '6px',
              color: !!isDarkMode
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            }}
          />
          <NavbarLinkText>
            <>{translate(`${i18Path}Links.Refuel`)}</>
          </NavbarLinkText>
        </>
      </NavbarLink>
    </NavbarLinkContainer>
  );
};

export default NavbarLinks;
