import { useTheme } from '@mui/material/styles';
import { BrandLogo } from '@transferto/shared';
import { useWallet } from '../../providers/WalletProvider';
import { useSettingsStore } from '../../stores';
import { NavbarBrandContainer, NavbarContainer } from './Navbar.style';
import { NavbarManagement, NavbarTabsContainer } from './index';

export const Navbar = () => {
  const theme = useTheme();
  const { account } = useWallet();
  const [onWelcomeScreenEntered] = useSettingsStore((state) => [
    state.onWelcomeScreenEntered,
  ]);

  const handleClick = () => {
    onWelcomeScreenEntered(false);
  };

  return (
    <NavbarContainer>
      <NavbarBrandContainer onClick={handleClick}>
        <BrandLogo isConnected={!!account.address} theme={theme} />
      </NavbarBrandContainer>
      <NavbarTabsContainer />
      <NavbarManagement />
    </NavbarContainer>
  );
};
