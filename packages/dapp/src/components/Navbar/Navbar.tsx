import { Link as MUILink } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { JumperIcon, JumperLogo } from '@transferto/shared/src/atoms/icons';
import { screenSize } from '@transferto/shared/src/style';
import { useWallet } from '../../providers/WalletProvider';
import { NavbarLinks, NavbarManagement } from './index';
import { NavbarContainer } from './Navbar.styled';
const Navbar = () => {
  const isTablet = useMediaQuery(`(${screenSize.minTablet})`);
  const { account } = useWallet();
  console.log('ACC:', account);
  return (
    <NavbarContainer>
      <MUILink href="/" sx={{ height: '48px' }}>
        {!isTablet && !!account.address ? <JumperIcon /> : <JumperLogo />}
      </MUILink>
      <NavbarLinks />
      <NavbarManagement />
    </NavbarContainer>
  );
};

export default Navbar;
