'use client';
import { MenuKeys, MenuKeysEnum } from '@/const/menuKeys';
import type {
  EcosystemSelectMenuProps,
  MenuState,
  SnackbarProps,
} from '@/types/menu';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface DefaultMenuType {
  openMainMenu: boolean;
  openWalletMenu: boolean;
  openWalletSelectMenu: boolean;
  openEcosystemSelect: EcosystemSelectMenuProps;
  openSubMenu: keyof typeof MenuKeys;
  openSupportModal: boolean;
  openSnackbar: SnackbarProps;
  isPopper: boolean;
}

export const defaultMenu: DefaultMenuType = {
  openMainMenu: false,
  openWalletMenu: false,
  openWalletSelectMenu: false,
  openEcosystemSelect: {},
  openSubMenu: MenuKeysEnum.None,
  openSupportModal: false,
  openSnackbar: { open: false },
  isPopper: true,
};

export const useMenuStore = createWithEqualityFn<MenuState>(
  (set, get) => ({
    ...defaultMenu,

    openedMenu: () => {
      const menuState = get();
      return (
        menuState.openMainMenu ||
        // menuState.openEcosystemSelect.open ||
        menuState.openSubMenu !== MenuKeys.None ||
        menuState.openSupportModal ||
        menuState.openWalletSelectMenu ||
        menuState.openWalletMenu
      );
      // Add your desired functionality here
    },

    // Close ALL Navbar Menus BUT the wallet menu
    closeAllMenus: () => {
      set((state) => ({
        openMainMenu: false,
        openWalletSelectMenu: false,
        openWalletMenu: state.openWalletMenu,
        openSubMenu: MenuKeysEnum.None,
        openSupportModal: false,
        openEcosystemSelect: {},
      }));
    },

    // Toggle Navbar Main Menu
    setMainMenuState: (open) => {
      set({
        openMainMenu: open,
        openSubMenu: MenuKeysEnum.None,
        openWalletSelectMenu: false,
        openWalletMenu: false,
        openSupportModal: false,
      });
    },

    // Toggle Navbar Wallet Menu
    setWalletSelectMenuState: (open, isPopper = true) => {
      set((state) => ({
        openWalletSelectMenu: open,
        openSubMenu: MenuKeysEnum.None,
        openMainMenu: false,
        isPopper: isPopper,
        openWalletMenu: false,
        openSupportModal: false,
      }));
    },

    // Toggle Navbar Connected Menu
    setWalletMenuState: (open) => {
      set({
        openWalletMenu: open,
        openSubMenu: MenuKeysEnum.None,
        openMainMenu: false,
        openWalletSelectMenu: false,
        openSupportModal: false,
      });
    },

    // Toggle Wallet Ecosystem Selection Menu
    setEcosystemSelectMenuState: (combinedWallet) => {
      set({
        openEcosystemSelect: { combinedWallet },
        openWalletSelectMenu: false,
        openSubMenu: MenuKeysEnum.None,
        openMainMenu: false,
        openWalletMenu: false,
        openSupportModal: false,
      });
    },

    // Toggle Navbar Sub Menu
    setSubMenuState: (subMenu, combinedWallet?) => {
      set((state) => ({
        openSubMenu: subMenu,
        openEcosystemSelect: { ...state.openEcosystemSelect, combinedWallet },
      }));
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
        openWalletSelectMenu: false,
        openWalletMenu: false,
        openSubMenu: MenuKeysEnum.None,
      });
    },
  }),
  shallow,
);
