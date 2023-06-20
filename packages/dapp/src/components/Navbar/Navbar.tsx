import { useTheme } from '@mui/material/styles';
import { BrandLogo } from '@transferto/shared/src/atoms/illustrations';
import { shallow } from 'zustand/shallow';
import { useWallet } from '../../providers/WalletProvider';
import { useSettingsStore } from '../../stores';
import { NavbarBrandContainer, NavbarContainer } from './Navbar.style';
import { NavbarManagement, NavbarTabsContainer } from './index';
const Navbar = () => {
  const theme = useTheme();
  const { account } = useWallet();
  const [onWelcomeScreenEntered] = useSettingsStore(
    (state) => [state.onWelcomeScreenEntered],
    shallow,
  );

  const handleClick = () => {
    onWelcomeScreenEntered(false);
  };

  return (
    <NavbarContainer>
      <NavbarBrandContainer href="/" onClick={handleClick}>
        <BrandLogo isConnected={!!account?.address} theme={theme} />
      </NavbarBrandContainer>
      <NavbarTabsContainer />
      <NavbarManagement />
    </NavbarContainer>
  );
};

export default Navbar;
