import { SyntheticEvent, useCallback } from 'react';
import { SubMenuKeys } from '../const/subMenuKeys';
import { useSharedMenu } from '../providers/MenuProvider';

export function useCloseMenu() {
  const { menu } = useMenu();

  const onHandleClose = useCallback(
    (event: Event | SyntheticEvent) => {
      event.preventDefault();
      if (
        menu?.anchorRef &&
        menu?.anchorRef?.contains(event.target as HTMLElement)
      ) {
        return;
      }
      // onCopyToClipboard(false);
    },
    [menu],
  );

  return { onHandleClose };
}

export function useMenu() {
  const [state, setState] = useSharedMenu();

  // CopyToClipboard
  const onCopyToClipboard = useCallback(
    (copied: boolean) => {
      setState((oldSettings) => ({
        ...oldSettings,
        copiedToClipboard: copied as boolean,
      }));
    },
    [setState],
  );

  // Close ALL Navbar Menus
  const onCloseAllNavbarMenus = useCallback(() => {
    setState((oldSettings) => ({
      ...oldSettings,
      openMainNavbarMenu: false,
      openNavbarWalletMenu: false,
      openNavbarConnectedMenu: false,
      openNavbarSubMenu: SubMenuKeys.none,
      copiedToClipboard: false,
    }));
  }, [setState]);

  // Set AnchorElement on Initialization of Navbar
  const onMenuInit = useCallback(
    (anchor: any) => {
      setState((oldSettings) => ({
        ...oldSettings,
        anchorRef: anchor,
      }));
    },
    [setState],
  );

  // Toggle Navbar Main Menu
  const onOpenNavbarMainMenu = useCallback(
    (open: boolean) => {
      setState((oldSettings) => ({
        ...oldSettings,
        openNavbarSubMenu: SubMenuKeys.none,
        openNavbarWalletMenu: false,
        openNavbarConnectedMenu: false,
        openMainNavbarMenu: open as boolean,
      }));
    },
    [setState],
  );

  // Toggle Navbar Wallet Menu
  const onOpenNavbarWalletMenu = useCallback(
    (open: boolean) => {
      setState((oldSettings) => ({
        ...oldSettings,
        openMainNavbarMenu: false,
        openNavbarConnectedMenu: false,
        openNavbarSubMenu: open
          ? SubMenuKeys.wallets
          : (SubMenuKeys.none as string),
        openNavbarWalletMenu: open,
      }));
    },
    [setState],
  );

  // Toggle Navbar Connected Menu
  const onOpenNavbarConnectedMenu = useCallback(
    (open: boolean) => {
      setState((oldSettings) => ({
        ...oldSettings,
        openMainNavbarMenu: false,
        openNavbarSubMenu: SubMenuKeys.none,
        openNavbarWalletMenu: false,
        openNavbarConnectedMenu: open as boolean,
      }));
    },
    [setState],
  );

  // Toggle Navbar Sub Menu
  const onOpenNavbarSubMenu = useCallback(
    (subMenu: string) => {
      setState((oldSettings) => ({
        ...oldSettings,
        openNavbarSubMenu: subMenu as string,
      }));
    },
    [setState],
  );

  // Toggle support modal
  const toggleSupportModal = useCallback(
    (open: boolean) => {
      setState((oldSettings) => ({
        ...oldSettings,
        openMainNavbarMenu: false,
        openNavbarSubMenu: SubMenuKeys.none,
        openNavbarWalletMenu: false,
        openNavbarConnectedMenu: false,
        openSupportModal: open,
      }));
    },
    [setState],
  );

  return {
    menu: state,
    onCopyToClipboard,
    onCloseAllNavbarMenus,
    onMenuInit,
    onOpenNavbarConnectedMenu,
    onOpenNavbarMainMenu,
    onOpenNavbarWalletMenu,
    onOpenNavbarSubMenu,
    toggleSupportModal,
  };
}
