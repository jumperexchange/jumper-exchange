import { create } from 'zustand';

// config
// @type
import { MenuProps, MenuState } from '@transferto/shared/src/types';
import { SubMenuKeys } from '../../const';

// ----------------------------------------------------------------------

interface DefaultMenuType {
  copiedToClipboard: boolean;
  openMainNavbarMenu: boolean;
  openNavbarWalletSelectMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarSubMenu: string;
  openSupportModal: boolean;
  anchorEl: null | JSX.Element;
}

export const defaultMenu: DefaultMenuType = {
  copiedToClipboard: false,
  openMainNavbarMenu: false,
  openNavbarWalletSelectMenu: false,
  openNavbarWalletMenu: false,
  openNavbarSubMenu: 'none',
  openSupportModal: false,
  anchorEl: null,
};
/*--  Use Zustand  --*/
export const useMenuStore = create<MenuState>((set, get) => ({
  ...defaultMenu,

  setValue: (key, value) =>
    set(() => ({
      [key]: value,
    })),
  setValues: (values) =>
    set((state) => {
      const updatedState: MenuProps = { ...state };
      for (const key in values) {
        if (Object.hasOwn(state, key)) {
          updatedState[key] = values[key];
        }
      }
      return updatedState;
    }),

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
      openNavbarWalletSelectMenu: false,
      openNavbarWalletMenu: false,
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
  onOpenNavbarWalletSelectMenu: (open: boolean) => {
    set({
      openNavbarSubMenu: open
        ? SubMenuKeys.wallets
        : (SubMenuKeys.none as string),
      openNavbarWalletSelectMenu: open as boolean,
    });
  },

  // Toggle Navbar Connected Menu
  onOpenNavbarWalletMenu: (open: boolean) => {
    set({
      openNavbarWalletMenu: open as boolean,
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
