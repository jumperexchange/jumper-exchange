import { useTheme } from '@mui/material/styles';
import { BrandLogo } from '@transferto/shared/src/atoms/illustrations';
import { useWallet } from '../../providers/WalletProvider';
import { NavbarBrandContainer, NavbarContainer } from './Navbar.style';
import { NavbarManagement, NavbarTabsContainer } from './index';
const Navbar = () => {
  const theme = useTheme();
  const { account } = useWallet();
  return (
    <>
      <NavbarContainer>
        <NavbarBrandContainer href="/">
          <BrandLogo isConnected={!!account?.address} theme={theme} />
        </NavbarBrandContainer>
        <NavbarManagement />
      </NavbarContainer>
      <NavbarTabsContainer />
    </>
  );
};

export default Navbar;
