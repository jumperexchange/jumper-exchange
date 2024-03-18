'use client';
import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';

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

export const Navbar = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  console.log('NAVBAR PATH:', pathname);
  const isLearnPage = pathname.includes('/learn');
  const { account } = useAccounts();
  const [onWelcomeScreenClosed] = useSettingsStore((state) => [
    state.onWelcomeScreenClosed,
  ]);
  const { closeAllMenus } = useMenuStore((state) => state);

  const handleClick = () => {
    closeAllMenus();
    onWelcomeScreenClosed(false);
    isLearnPage ? router.push(JUMPER_LEARN_PATH) : router.push('/');
  };

  return (
    <Container>
      <LogoLink onClick={handleClick} sx={{ height: '32px' }}>
        <Logo
          isConnected={!!account?.address}
          theme={theme}
          logo={isLearnPage ? <JumperLearnLogo /> : <JumperLogo />}
        />
      </LogoLink>
      {!isLearnPage ? <NavbarTabs /> : null}
      <NavbarButtons redirectToLearn={isLearnPage} />
    </Container>
  );
};
