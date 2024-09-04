'use client';
import { usePathname, useRouter } from 'next/navigation';

import {
  JUMPER_DISCOVER_PATH,
  JUMPER_LEARN_PATH,
  JUMPER_LOYALTY_PATH,
  JUMPER_QUESTS_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
} from '@/const/urls';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useMenuStore } from '@/stores/menu';
import { useSuperfest } from 'src/hooks/useSuperfest';
import {
  NavbarContainer as Container,
  Logo,
  LogoLink,
  NavbarButtons,
  NavbarTabs,
} from '.';

export const Navbar = ({ disableNavbar = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLearnPage = pathname?.includes(JUMPER_LEARN_PATH);
  const isLoyaltyPage = pathname?.includes(JUMPER_LOYALTY_PATH);
  const isDiscoverPage = pathname?.includes(JUMPER_DISCOVER_PATH);
  const isScanPage =
    pathname?.includes(JUMPER_SCAN_PATH) ||
    pathname?.includes(JUMPER_TX_PATH) ||
    pathname?.includes(JUMPER_WALLET_PATH);
  const isQuestsPage = pathname?.includes(JUMPER_QUESTS_PATH);
  const { isSuperfest } = useSuperfest();
  const { setWelcomeScreenClosed } = useWelcomeScreen();

  const { closeAllMenus } = useMenuStore((state) => state);
  const handleClick = () => {
    closeAllMenus();
    setWelcomeScreenClosed(false);

    if (pathname === '/gas/') {
      return;
    }
    if (isLearnPage) {
      router.push(JUMPER_LEARN_PATH);
    } else if (isScanPage) {
      router.push(JUMPER_SCAN_PATH);
    } else {
      router.push('/');
    }
  };

  return (
    <Container>
      <LogoLink id="jumper-logo" onClick={handleClick}>
        <Logo
          variant={isScanPage ? 'scan' : isLearnPage ? 'learn' : 'default'}
        />
      </LogoLink>
      {!isScanPage && !isLearnPage && !disableNavbar && (
        <NavbarTabs
          navbarPageReload={
            isLoyaltyPage || isSuperfest || isQuestsPage || isDiscoverPage
          }
        />
      )}
      <NavbarButtons />
    </Container>
  );
};
