'use client';

import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useMenuStore } from 'src/stores/menu';
import { useThemeStore } from 'src/stores/theme';
import { Logo, NavbarButtons, NavbarContainer } from '.';

export const Navbar = ({ disableNavbar = false }) => {
  const configTheme = useThemeStore((state) => state.configTheme);
  const { setWelcomeScreenClosed } = useWelcomeScreen();

  const { closeAllMenus } = useMenuStore((state) => state);
  const handleClick = () => {
    closeAllMenus();
    setWelcomeScreenClosed(false);
  };

  return (
    <NavbarContainer hasBlurredNavigation={configTheme?.hasBlurredNavigation}>
      <Logo handleClick={handleClick} />
      <NavbarButtons />
    </NavbarContainer>
  );
};
