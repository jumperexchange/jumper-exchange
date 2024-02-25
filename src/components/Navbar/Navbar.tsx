import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Logo, NavbarButtons, NavbarTabs } from 'src/components';
import { useAccounts } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import { NavbarContainer as Container, LogoLink } from '.';

interface NavbarProps {
  hideNavbarTabs?: boolean;
  redirectConnect?: boolean;
}

export const Navbar = ({ hideNavbarTabs, redirectConnect }: NavbarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { account } = useAccounts();
  const [onWelcomeScreenClosed] = useSettingsStore((state) => [
    state.onWelcomeScreenClosed,
  ]);

  const handleClick = () => {
    onWelcomeScreenClosed(false);
    navigate('/');
  };

  return (
    <Container>
      <LogoLink onClick={handleClick}>
        <Logo isConnected={!!account?.address} theme={theme} />
      </LogoLink>
      {!hideNavbarTabs ? <NavbarTabs /> : null}
      <NavbarButtons redirectConnect={redirectConnect} />
    </Container>
  );
};
