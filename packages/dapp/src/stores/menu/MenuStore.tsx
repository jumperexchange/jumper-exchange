import { create } from 'zustand';

// config
// @type
import { SubMenuKeys } from '../../const';

// ----------------------------------------------------------------------

interface defaultMenuType {
  copiedToClipboard: boolean;
  openMainNavbarMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarConnectedMenu: boolean;
  openNavbarSubMenu: string;
  openSupportModal: boolean;
  anchorEl: null | JSX.Element;
}

export const defaultMenu: defaultMenuType = {
  copiedToClipboard: false,
  openMainNavbarMenu: false,
  openNavbarWalletMenu: false,
  openNavbarConnectedMenu: false,
  openNavbarSubMenu: 'none',
  openSupportModal: false,
  anchorEl: null,
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
