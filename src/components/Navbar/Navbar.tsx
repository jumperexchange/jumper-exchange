import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  JumperLearnLogo,
  JumperLogo,
  NavbarButtons,
  NavbarTabs,
} from 'src/components';
import { useAccounts } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import { NavbarContainer as Container, Logo, LogoLink } from '.';

interface NavbarProps {
  hideNavbarTabs?: boolean;
  redirectToLearn?: boolean;
}

export const Navbar = ({ hideNavbarTabs, redirectToLearn }: NavbarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { account } = useAccounts();
  const [onWelcomeScreenClosed] = useSettingsStore((state) => [
    state.onWelcomeScreenClosed,
  ]);

  const handleClick = () => {
    onWelcomeScreenClosed(false);
    redirectToLearn ? navigate('/learn') : navigate('/');
  };

  return (
    <Container>
      <LogoLink onClick={handleClick} sx={{ height: '32px' }}>
        <Logo
          isConnected={!!account?.address}
          theme={theme}
          logo={redirectToLearn ? <JumperLearnLogo /> : <JumperLogo />}
        />
      </LogoLink>
      {!hideNavbarTabs ? <NavbarTabs /> : null}
      <NavbarButtons redirectToLearn={redirectToLearn} />
    </Container>
  );
};
