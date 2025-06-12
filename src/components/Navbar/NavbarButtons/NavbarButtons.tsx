'use client';
import { MainMenu } from '@/components/Menus/MainMenu';
import { useMenuStore } from '@/stores/menu';
// import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
// import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { WalletMenu } from 'src/components/Menus/WalletMenu';
import {
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
} from 'src/const/urls';
import {
  MenuToggle,
  DotsMenuIcon,
  NavbarButtonsContainer,
  RedirectToApp,
  // FloatingLinksContainer,
  // LinksContainer,
} from '.';
import dynamic from 'next/dynamic';
// import { Links } from './Links';

const WalletButtons = dynamic(
  () => import('../WalletButtons').then((mod) => mod.WalletButtons),
  {
    ssr: false,
  },
);

export const NavbarButtons = () => {
  const mainMenuAnchor = useRef(null);
  // const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const walletManagementRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const hideConnectButton = pathname?.includes(JUMPER_LEARN_PATH);
  const redirectToApp =
    pathname?.includes(JUMPER_LEARN_PATH) ||
    pathname?.includes(JUMPER_SCAN_PATH) ||
    pathname?.includes(JUMPER_TX_PATH) ||
    pathname?.includes(JUMPER_WALLET_PATH);

  const [openedMenu, openMainMenu, setMainMenuState] = useMenuStore((state) => [
    state.openedMenu,
    state.openMainMenu,
    state.setMainMenuState,
  ]);
  // return focus to the button when we transitioned from !open -> open
  const prevMainMenu = useRef(openMainMenu);
  useEffect(() => {
    if (prevMainMenu.current === true && openMainMenu === false) {
      mainMenuAnchor.current && (mainMenuAnchor.current as HTMLElement).focus();
    }

    prevMainMenu.current = openMainMenu;
  }, [openMainMenu]);

  const handleOnOpenNavbarMainMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const menuOpen = openedMenu();
    if (menuOpen) {
      setMainMenuState(false);
    } else {
      setMainMenuState(true);
    }
  };

  return (
    <>
      {/* @Note: This will be enabled once the missions page is implemented */}
      {/* {isDesktop && (
        <LinksContainer>
          <Links />
        </LinksContainer>
      )} */}

      <NavbarButtonsContainer className="settings">
        {(redirectToApp || !hideConnectButton) && (
          <Box ref={walletManagementRef} display="flex" flexDirection="row">
            {redirectToApp && (
              <RedirectToApp hideConnectButton={hideConnectButton} />
            )}
            {!hideConnectButton && <WalletButtons />}
          </Box>
        )}
        {/* @Note: This will be enabled once the missions page is implemented */}
        {/* {isDesktop && (
          <MenuToggle
            ref={mainMenuAnchor}
            id="main-burger-menu-button"
            aria-label="Main Menu"
            aria-controls={openMainMenu ? 'main-burger-menu' : undefined}
            aria-expanded={openMainMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleOnOpenNavbarMainMenu}
          >
            <DotsMenuIcon />
          </MenuToggle>
        )} */}
        <MenuToggle
          ref={mainMenuAnchor}
          id="main-burger-menu-button"
          aria-label="Main Menu"
          aria-controls={openMainMenu ? 'main-burger-menu' : undefined}
          aria-expanded={openMainMenu ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleOnOpenNavbarMainMenu}
        >
          <DotsMenuIcon />
        </MenuToggle>
      </NavbarButtonsContainer>

      <MainMenu anchorEl={mainMenuAnchor.current ?? undefined} />
      <WalletMenu anchorEl={walletManagementRef.current ?? undefined} />

      {/* @Note: This will be enabled once the missions page is implemented */}
      {/* <Portal>
        {!isDesktop && (
          <FloatingLinksContainer direction="row">
            <Links />
            <MenuToggle
              ref={mainMenuAnchor}
              id="main-burger-menu-button"
              aria-label="Main Menu"
              aria-controls={openMainMenu ? 'main-burger-menu' : undefined}
              aria-expanded={openMainMenu ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleOnOpenNavbarMainMenu}
            >
              <DotsMenuIcon />
            </MenuToggle>
          </FloatingLinksContainer>
        )}
      </Portal> */}
    </>
  );
};
