import { Link as MUILink } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BrandLogo } from '@transferto/shared/src/atoms/icons';
import { useWallet } from '../../providers/WalletProvider';
import { NavbarManagement, NavbarTabsContainer } from './index';
import { NavbarContainer } from './Navbar.styled';
const Navbar = () => {
  const theme = useTheme();
  const { account } = useWallet();
  return (
    <NavbarContainer>
      <MUILink href="/" sx={{ height: '48px' }}>
        <BrandLogo connected={!!account.address} theme={theme} />
      </MUILink>
      <NavbarTabsContainer />
      <NavbarManagement />
    </NavbarContainer>
  );
};

export default Navbar;
