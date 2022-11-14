import { Swap } from '@transferto/shared/src/atoms/icons';
import { useLocales } from '@transferto/shared/src/hooks';
import { useLocation } from 'react-router-dom';
import {
  NavbarLink,
  NavbarLinkContainer,
  NavbarLinkText,
} from './Navbar.styled';

const NavbarLinks = () => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  const swapUrl = '/swap';
  const dashboardUrl = '/dashboard'; // --> will be replaced with gas-feature
  const location = useLocation();

  return (
    <NavbarLinkContainer className="navbar-container">
      <NavbarLink
        active={
          (location.pathname.includes(swapUrl) || location.pathname === '/') ??
          true
        }
        href={swapUrl}
        hoverBackgroundColor={'#f5b5ff7a'}
      >
        <>
          <Swap style={{ marginRight: '6px' }} />
          <NavbarLinkText>
            <>{translate(`${i18Path}Swap`)}</>
          </NavbarLinkText>
        </>
      </NavbarLink>
      <NavbarLink
        active={location.pathname.includes(dashboardUrl) ?? true}
        href={dashboardUrl}
        hoverBackgroundColor={'#f5b5ff7a'}
      >
        <NavbarLinkText>
          <>{translate(`${i18Path}Dashboard`)}</>
        </NavbarLinkText>
      </NavbarLink>
    </NavbarLinkContainer>
  );
};

export default NavbarLinks;
