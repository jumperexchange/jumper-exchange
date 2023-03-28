import { create } from 'zustand';

// config
import { defaultMenu } from '@transferto/shared/src';
// @type
import type { MenuContextProps } from '@transferto/shared/src/types/Menu';
import { SubMenuKeys } from '../../const';

// ----------------------------------------------------------------------

const initialState: MenuContextProps = {
  ...defaultMenu,

  // CopyClipboard
  onCopyToClipboard: () => {},

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => {},

  // On Initialization of Menu
  onMenuInit: () => {},

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: () => {},

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: () => {},

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: () => {},

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: () => {},

  // Toggle support modal
  toggleSupportModal: () => {},
};

/*--  Use Zustand  --*/

export const useMenuStore = create((set) => ({
  ...defaultMenu,

  // CopyToClipboard
  onCopyToClipboard: (copied: boolean) => {
    set({
      copiedToClipboard: copied as boolean,
    });
  },

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => {
    set({
      copiedToClipboard: false,
      openMainNavbarMenu: false,
      openNavbarWalletMenu: false,
      openNavbarConnectedMenu: false,
      openNavbarSubMenu: SubMenuKeys.none,
      openSupportModal: false,
    });
  },

  // Set AnchorElement on Initialization of Navbar
  onMenuInit: (anchorRef: JSX.Element) => {
    set({
      anchorRef,
    });
  },

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: (open: boolean) => {
    set({
      openMainNavbarMenu: open as boolean,
    });
  },

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: (open: boolean) => {
    set({
      openNavbarSubMenu: open
        ? SubMenuKeys.wallets
        : (SubMenuKeys.none as string),
      openNavbarWalletMenu: open as boolean,
    });
  },

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: (open: boolean) => {
    set({
      openNavbarConnectedMenu: open as boolean,
    });
  },

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: (subMenu: string) => {
    set({
      openNavbarSubMenu: subMenu as string,
    });
  },

  // Toggle support modal
  toggleSupportModal: (open: boolean) => {
    set({
      openMainNavbarMenu: false,
      openSupportModal: open,
    });
  },
}));
