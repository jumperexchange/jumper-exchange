import { useTheme } from '@mui/material/styles';
import { BrandLogo } from 'src/atoms';
import {
  NavbarBrandContainer,
  NavbarContainer,
  NavbarManagement,
  NavbarTabsContainer,
} from 'src/components';
import { useWallet } from 'src/providers';
import { useSettingsStore } from 'src/stores';

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
