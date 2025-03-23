'use client';

import { useThemeStore } from 'src/stores/theme';
import { Logo, NavbarButtons, NavbarContainer } from '.';

export const Navbar = ({ disableNavbar = false }) => {
  const configTheme = useThemeStore((state) => state.configTheme);

  return (
    <NavbarContainer hasBlurredNavigation={configTheme?.hasBlurredNavigation}>
      <Logo />
      <NavbarButtons />
    </NavbarContainer>
  );
};
