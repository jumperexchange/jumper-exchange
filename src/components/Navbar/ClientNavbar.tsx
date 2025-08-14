'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { AppPaths } from '@/const/urls';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useMenuStore } from '@/stores/menu';
import { useThemeStore } from 'src/stores/theme';
import { LogoLinkWrapper, NavbarContainer } from '.';
import { Logo } from './components/Logo/Logo';
import { Layout } from './layout/Layout';
import { checkIsLearnPage, checkIsScanPage } from './utils';

export const ClientNavbar = () => {
  const pathname = usePathname();
  const isLearnPage = checkIsLearnPage(pathname);
  const isScanPage = checkIsScanPage(pathname);

  const { setWelcomeScreenClosed } = useWelcomeScreen();
  const configTheme = useThemeStore((state) => state.configTheme);

  const { closeAllMenus } = useMenuStore((state) => state);
  const handleClick = () => {
    closeAllMenus();
    setWelcomeScreenClosed(false);
  };

  const logoHref = useMemo(() => {
    if (isLearnPage) {
      return AppPaths.Learn;
    } else if (isScanPage) {
      return AppPaths.Scan;
    } else {
      return AppPaths.Main;
    }
  }, [isLearnPage, isScanPage]);

  return (
    <NavbarContainer
      enableColorOnDark
      hasBlurredNavigation={configTheme?.hasBlurredNavigation}
    >
      <LogoLinkWrapper href={logoHref} id="jumper-logo" onClick={handleClick}>
        <Logo
          variant={isScanPage ? 'scan' : isLearnPage ? 'learn' : 'default'}
        />
      </LogoLinkWrapper>
      <Layout hideConnectButton={isLearnPage} />
    </NavbarContainer>
  );
};
