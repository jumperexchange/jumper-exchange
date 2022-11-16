import { Swap } from '@transferto/shared/src/atoms/icons';
import { useLocales } from '@transferto/shared/src/hooks';
import { useLocation } from 'react-router-dom';
import { Gas } from '@transferto/shared/src/atoms/icons';
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
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  const location = useLocation();

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
          <Swap style={{ marginRight: '6px' }} />
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
          <Gas style={{ marginRight: '6px' }} />
          <NavbarLinkText>
            <>{translate(`${i18Path}Links.Refuel`)}</>
          </NavbarLinkText>
        </>
      </NavbarLink>
    </NavbarLinkContainer>
  );
};

export default NavbarLinks;
