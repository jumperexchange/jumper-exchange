'use client';
import { MainMenu } from '@/components/Menus/MainMenu';
import { useMenuStore } from '@/stores/menu';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { EcosystemSelectMenu } from 'src/components/Menus/EcosystemSelectMenu';
import { WalletMenu } from 'src/components/Menus/WalletMenu';
import { WalletSelectMenu } from 'src/components/Menus/WalletSelectMenu';
import {
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
} from 'src/const/urls';
import { MenuToggle, NavbarButtonsContainer, RedirectToApp } from '.';
import { WalletButtons } from '../WalletButton';

export const NavbarButtons = () => {
  const mainMenuAnchor = useRef(null);

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
      <NavbarButtonsContainer className="settings">
        {(redirectToApp || !hideConnectButton) && (
          <Box ref={walletManagementRef}>
            {redirectToApp && (
              <RedirectToApp hideConnectButton={hideConnectButton} />
            )}
            {!hideConnectButton && <WalletButtons />}
          </Box>
        )}

        <MenuToggle
          ref={mainMenuAnchor}
          id="main-burger-menu-button"
          aria-label="Main Menu"
          aria-controls={openMainMenu ? 'main-burger-menu' : undefined}
          aria-expanded={openMainMenu ? 'true' : undefined}
          aria-haspopup="true"
          onClick={(e) => handleOnOpenNavbarMainMenu(e)}
        >
          <MenuIcon
            sx={{
              fontSize: '32px',
              color: 'inherit',
            }}
          />
        </MenuToggle>
      </NavbarButtonsContainer>
      <MainMenu anchorEl={mainMenuAnchor.current ?? undefined} />
      <WalletMenu anchorEl={walletManagementRef.current ?? undefined} />
      <WalletSelectMenu anchorEl={walletManagementRef.current || undefined} />
    </>
  );
};
