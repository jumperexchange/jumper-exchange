'use client';
import { usePathname } from 'next/navigation';

import {
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
  JUMPER_WASH_PATH,
} from '@/const/urls';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useMenuStore } from '@/stores/menu';
import {
  NavbarContainer as Container,
  Logo,
  LogoLink,
  NavbarButtons,
  NavbarTabs,
} from '.';

export const Navbar = ({ disableNavbar = false }) => {
  const pathname = usePathname();
  const isLearnPage = pathname?.includes(JUMPER_LEARN_PATH);
  const isScanPage =
    pathname?.includes(JUMPER_SCAN_PATH) ||
    pathname?.includes(JUMPER_TX_PATH) ||
    pathname?.includes(JUMPER_WALLET_PATH);
  const isWashPage = pathname?.includes(JUMPER_WASH_PATH);
  const { setWelcomeScreenClosed } = useWelcomeScreen();

  const { closeAllMenus } = useMenuStore((state) => state);
  const handleClick = () => {
    closeAllMenus();
    setWelcomeScreenClosed(false);
  };

  let logoHref;
  if (isLearnPage) {
    logoHref = JUMPER_LEARN_PATH;
  } else if (isScanPage) {
    logoHref = JUMPER_SCAN_PATH;
  } else {
    logoHref = '/';
  }

  return (
    <Container>
      <LogoLink href={logoHref} id="jumper-logo" onClick={handleClick}>
        <Logo
          variant={isScanPage ? 'scan' : isLearnPage ? 'learn' : 'default'}
        />
      </LogoLink>
      {isWashPage && <NavbarTabs />}
      <NavbarButtons />
    </Container>
  );
};
