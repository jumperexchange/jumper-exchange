'use client';
import { usePathname } from 'next/navigation';

import {
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
} from '@/const/urls';
import { useThemeStore } from 'src/stores/theme';
import { Logo, NavbarButtons, NavbarContainer } from '.';

export const Navbar = ({ disableNavbar = false }) => {
  const pathname = usePathname();
  const isLearnPage = pathname?.includes(JUMPER_LEARN_PATH);
  const isScanPage =
    pathname?.includes(JUMPER_SCAN_PATH) ||
    pathname?.includes(JUMPER_TX_PATH) ||
    pathname?.includes(JUMPER_WALLET_PATH);
  const configTheme = useThemeStore((state) => state.configTheme);

  let logoHref;
  if (isLearnPage) {
    logoHref = JUMPER_LEARN_PATH;
  } else if (isScanPage) {
    logoHref = JUMPER_SCAN_PATH;
  } else {
    logoHref = '/';
  }

  return (
    <NavbarContainer hasBlurredNavigation={configTheme?.hasBlurredNavigation}>
      <Logo variant={isScanPage ? 'scan' : isLearnPage ? 'learn' : 'default'} />
      <NavbarButtons />
    </NavbarContainer>
  );
};
