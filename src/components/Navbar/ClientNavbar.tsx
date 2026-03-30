'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { AppPaths } from '@/const/urls';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useMenuStore } from '@/stores/menu';
import { useThemeStore } from 'src/stores/theme';
import { LogoLinkWrapper, NavbarContainer } from './Navbar.style';
import { Logo } from './components/Logo/Logo';
import { Layout } from './layout/Layout';
import {
  checkIsLearnPage,
  checkIsScanPage,
  checkIsPrivacyPolicyPage,
} from './utils';
import { HideOnScroll } from '../core/HideOnScroll/HideOnScroll';

export const ClientNavbar = () => {
  const pathname = usePathname();
  const isLearnPage = checkIsLearnPage(pathname);
  const isScanPage = checkIsScanPage(pathname);
  const isPrivacyPolicyPage = checkIsPrivacyPolicyPage(pathname);

  const { setWelcomeScreenClosed } = useWelcomeScreen();
  const configTheme = useThemeStore((state) => state.configTheme);

  const { closeAllMenus } = useMenuStore((state) => state);
  const handleClick = () => {
    closeAllMenus();
    setWelcomeScreenClosed(false);
  };

  const { href, variant } = useMemo(() => {
    if (isLearnPage) {
      return {
        href: AppPaths.Learn,
        variant: 'learn' as const,
      };
    } else if (isScanPage) {
      return {
        href: AppPaths.Scan,
        variant: 'scan' as const,
      };
    } else if (isPrivacyPolicyPage) {
      return {
        href: AppPaths.PrivacyPolicy,
        variant: 'default' as const,
      };
    }

    return {
      href: AppPaths.Main,
      variant: 'default' as const,
    };
  }, [isLearnPage, isScanPage, isPrivacyPolicyPage]);

  return (
    <HideOnScroll>
      <NavbarContainer
        enableColorOnDark
        hasBlurredNavigation={configTheme?.hasBlurredNavigation}
      >
        <LogoLinkWrapper href={href} id="jumper-logo" onClick={handleClick}>
          <Logo variant={variant} />
        </LogoLinkWrapper>
        <Layout />
      </NavbarContainer>
    </HideOnScroll>
  );
};
