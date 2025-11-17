'use client';
import { MenuKeys, MenuKeysEnum } from '@/const/menuKeys';
import type { MenuState, SnackbarProps } from '@/types/menu';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface DefaultMenuType {
  openMainMenu: boolean;
  openWalletMenu: boolean;
  openSubMenu: keyof typeof MenuKeys;
  openSupportModal: boolean;
  openSnackbar: SnackbarProps;
}

export const defaultMenu: DefaultMenuType = {
  openMainMenu: false,
  openWalletMenu: false,
  openSubMenu: MenuKeysEnum.None,
  openSupportModal: false,
  openSnackbar: { open: false },
};

export const useMenuStore = createWithEqualityFn<MenuState>(
  (set, get) => ({
    ...defaultMenu,

    openedMenu: () => {
      const menuState = get();
      return (
        menuState.openMainMenu ||
        menuState.openSubMenu !== MenuKeys.None ||
        menuState.openSupportModal ||
        menuState.openWalletMenu
      );
      // Add your desired functionality here
    },

    // Close ALL Navbar Menus
    closeAllMenus: () => {
      set({
        openMainMenu: false,
        openWalletMenu: false,
        openSubMenu: MenuKeysEnum.None,
        openSupportModal: false,
      });
    },

    // Toggle Navbar Main Menu
    setMainMenuState: (open) => {
      set({
        openMainMenu: open,
        openSubMenu: MenuKeysEnum.None,
        openWalletMenu: get().openWalletMenu,
        openSupportModal: false,
      });
    },

    // Toggle Navbar Connected Menu
    setWalletMenuState: (open) => {
      set({
        openWalletMenu: open,
        openSubMenu: MenuKeysEnum.None,
        openMainMenu: false,
        openSupportModal: false,
      });
    },

    // Toggle Navbar Sub Menu
    setSubMenuState: (subMenu) => {
      set({
        openSubMenu: subMenu,
      });
    },

    // Open Snackbar and set label
    setSnackbarState: (open, label, severity) => {
      set((state) => ({
        ...state,
        openSnackbar: {
          open: open,
          label: label || state.openSnackbar.label,
          severity: severity || state.openSnackbar.severity,
        },
      }));
    },

    // Toggle support modal
    setSupportModalState: (open) => {
      set({
        openSupportModal: open,
        openMainMenu: false,
        openWalletMenu: false,
        openSubMenu: MenuKeysEnum.None,
      });
    },
  }),
  shallow,
);
