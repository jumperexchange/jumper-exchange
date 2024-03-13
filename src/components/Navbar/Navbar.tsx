'use client';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import { useAccounts } from '@/hooks/useAccounts';
import { JUMPER_LEARN_PATH } from 'src/const';
import { useMenuStore, useSettingsStore } from 'src/stores';
import {
  NavbarContainer as Container,
  Logo,
  LogoLink,
  NavbarButtons,
  NavbarTabs,
} from '.';
import { JumperLearnLogo } from '../illustrations/JumperLearnLogo';
import { JumperLogo } from '../illustrations/JumperLogo';

interface NavbarProps {
  hideNavbarTabs?: boolean;
  redirectToLearn?: boolean;
}

export const Navbar = ({ hideNavbarTabs, redirectToLearn }: NavbarProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { account } = useAccounts();
  const [onWelcomeScreenClosed] = useSettingsStore((state) => [
    state.onWelcomeScreenClosed,
  ]);
  const { closeAllMenus } = useMenuStore((state) => state);

  const handleClick = () => {
    closeAllMenus();
    onWelcomeScreenClosed(false);
    redirectToLearn ? router.push(JUMPER_LEARN_PATH) : router.push('/');
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
