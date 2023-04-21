import { MenuProps, MenuState } from '@transferto/shared/src/types';
import { create } from 'zustand';
import { MenuKeys } from '../../const';

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
      anchorRef: null,
    });
  },

  // Set AnchorElement on Initialization of Navbar
  onMenuInit: () => {
    set({});
  },

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: (open, anchorRef) => {
    set({
      openMainNavbarMenu: open,
      openNavbarSubMenu: MenuKeys.None,
      anchorRef: open ? anchorRef : null,
    });
  },

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletSelectMenu: (open, anchorRef) => {
    set({
      openNavbarWalletSelectMenu: open,
      openNavbarSubMenu: MenuKeys.None,
      anchorRef: open ? anchorRef : null,
    });
  },

  // Toggle Navbar Connected Menu
  onOpenNavbarWalletMenu: (open, anchorRef) => {
    set({
      openNavbarWalletMenu: open,
      openNavbarSubMenu: MenuKeys.None,
      anchorRef: open ? anchorRef : null,
    });
  },

  // Toggle Navbar Chains Menu
  onOpenNavbarChainsMenu: (open, anchorRef) => {
    set({
      openNavbarChainsMenu: open,
      openNavbarSubMenu: MenuKeys.None,
      anchorRef: open ? anchorRef : null,
    });
  },

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: (subMenu) => {
    set({
      openNavbarSubMenu: subMenu,
    });
  },

  // Toggle support modal
  onOpenSupportModal: (open) => {
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
