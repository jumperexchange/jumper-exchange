'use client';
import { usePathname, useRouter } from 'next/navigation';

import { JUMPER_LEARN_PATH, JUMPER_LOYALTY_PATH } from '@/const/urls';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useMenuStore } from '@/stores/menu';
import {
  NavbarContainer as Container,
  Logo,
  LogoLink,
  NavbarButtons,
  NavbarTabs,
} from '.';
import { useSuperfest } from 'src/hooks/useSuperfest';

export const Navbar = ({ disableNavbar = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLearnPage = pathname?.includes(JUMPER_LEARN_PATH);
  const isLoyaltyPage = pathname?.includes(JUMPER_LOYALTY_PATH);
  const { isSuperfest } = useSuperfest();
  const { setWelcomeScreenClosed } = useWelcomeScreen();

  const { closeAllMenus } = useMenuStore((state) => state);
  const handleClick = () => {
    closeAllMenus();
    setWelcomeScreenClosed(false);

    if (pathname === '/gas/') {
      return;
    }

    isLearnPage ? router.push(JUMPER_LEARN_PATH) : router.push('/');
  };

  return (
    <Container>
      <LogoLink id="jumper-logo" onClick={handleClick}>
        <Logo variant={isLearnPage ? 'learn' : 'default'} />
      </LogoLink>
      {!isLearnPage && !disableNavbar && (
        <NavbarTabs navbarPageReload={isLoyaltyPage || isSuperfest} />
      )}
      <NavbarButtons />
    </Container>
  );
};
