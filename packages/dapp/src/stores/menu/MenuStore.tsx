import { create } from 'zustand';

// config
// @type
import { MenuProps, MenuState } from '@transferto/shared/src/types';
import { MenuKeys } from '../../const';

// ----------------------------------------------------------------------

interface DefaultMenuType {
  openMainNavbarMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarChainsMenu: boolean;
  openNavbarWalletSelectMenu: boolean;
  openNavbarSubMenu: keyof typeof MenuKeys;
  openSupportModal: boolean;
  anchorRef: null | JSX.Element;
}

export const defaultMenu: DefaultMenuType = {
  openMainNavbarMenu: false,
  openNavbarWalletMenu: false,
  openNavbarChainsMenu: false,
  openNavbarWalletSelectMenu: false,
  openNavbarSubMenu: 'None',
  openSupportModal: false,
  anchorRef: null,
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

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => {
    set({
      openMainNavbarMenu: false,
      openNavbarWalletSelectMenu: false,
      openNavbarWalletMenu: false,
      openNavbarChainsMenu: false,
      openNavbarSubMenu: MenuKeys.None,
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
      openNavbarSubMenu: MenuKeys.None,
    });
  },

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletSelectMenu: (open: boolean) => {
    set({
      openNavbarWalletSelectMenu: open as boolean,
      openNavbarSubMenu: MenuKeys.None,
    });
  },

  // Toggle Navbar Connected Menu
  onOpenNavbarWalletMenu: (open: boolean) => {
    set({
      openNavbarWalletMenu: open as boolean,
      openNavbarSubMenu: MenuKeys.None,
    });
  },

  // Toggle Navbar Chains Menu
  onOpenNavbarChainsMenu: (open: boolean) => {
    set({
      openNavbarChainsMenu: open as boolean,
      openNavbarSubMenu: MenuKeys.None,
    });
  },

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: (subMenu: MenuKeys) => {
    set({
      openNavbarSubMenu: subMenu,
    });
  },

  // Toggle support modal
  onOpenSupportModal: (open: boolean) => {
    set({
      openMainNavbarMenu: false,
      openNavbarChainsMenu: false,
      openNavbarWalletSelectMenu: false,
      openNavbarWalletMenu: false,
      openSupportModal: open,
      openNavbarSubMenu: MenuKeys.None,
    });
  },
}));
