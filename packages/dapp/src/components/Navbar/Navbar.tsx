import { useTheme } from '@mui/material/styles';
import { BrandLogo } from '@transferto/shared/src/atoms/illustrations';
import { useWallet } from '../../providers/WalletProvider';
import { NavbarManagement, NavbarTabsContainer } from './index';
import { NavbarBrandContainer, NavbarContainer } from './Navbar.style';
const Navbar = () => {
  const theme = useTheme();
  const { account } = useWallet();
  return (
    <NavbarContainer>
      <NavbarBrandContainer href="/">
        <BrandLogo isConnected={!!account?.address} theme={theme} />
      </NavbarBrandContainer>
      <NavbarTabsContainer />
      <NavbarManagement />
    </NavbarContainer>
  );
};

export default Navbar;
