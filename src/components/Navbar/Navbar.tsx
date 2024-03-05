'use client';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  JumperLearnLogo,
  JumperLogo,
  NavbarButtons,
  NavbarTabs,
} from 'src/components';
import { JUMPER_LEARN_PATH } from 'src/const';
import { useAccounts } from 'src/hooks';
import { useMenuStore, useSettingsStore } from 'src/stores';
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
  const { closeAllMenus } = useMenuStore((state) => state);

  const handleClick = () => {
    closeAllMenus();
    onWelcomeScreenClosed(false);
    redirectToLearn ? navigate(JUMPER_LEARN_PATH) : navigate('/');
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
