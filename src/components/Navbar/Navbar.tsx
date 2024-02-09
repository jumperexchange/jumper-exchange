import { useTheme } from '@mui/material/styles';
import { Logo, NavbarButtons, NavbarTabs } from 'src/components';
import { useAccounts } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import { NavbarContainer as Container, LogoLink } from '.';

export const Navbar = () => {
  const theme = useTheme();
  const { account } = useAccounts();
  const [onWelcomeScreenClosed] = useSettingsStore((state) => [
    state.onWelcomeScreenClosed,
  ]);

  const handleClick = () => {
    onWelcomeScreenClosed(false);
  };

  return (
    <Container>
      <LogoLink onClick={handleClick}>
        <Logo isConnected={!!account.address} theme={theme} />
      </LogoLink>
      <NavbarTabs />
      <NavbarButtons />
    </Container>
  );
};
