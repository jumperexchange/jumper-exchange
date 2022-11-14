import { Link as MUILink } from '@mui/material';
import { JumperLogo } from '@transferto/shared/src/atoms/icons';
import { NavbarLinks, NavbarManagement } from './index';
import { NavbarContainer } from './Navbar.styled';

const Navbar = () => {
  return (
    <NavbarContainer>
      <MUILink href="/" sx={{ height: '48px' }}>
        <JumperLogo />
      </MUILink>
      <NavbarLinks />
      <NavbarManagement />
    </NavbarContainer>
  );
};

export default Navbar;
