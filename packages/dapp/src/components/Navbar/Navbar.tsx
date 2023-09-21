import { useTheme } from '@mui/material/styles';
import { BrandLogo } from '@transferto/shared';
import {
  NavbarBrandContainer,
  NavbarContainer,
  NavbarManagement,
  NavbarTabsContainer,
} from 'components';
import { useWallet } from 'providers';
import { useSettingsStore } from 'stores';

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
