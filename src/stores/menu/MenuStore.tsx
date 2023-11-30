import { MenuKeys } from 'src/const';
import type { MenuState, SnackbarProps } from 'src/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface DefaultMenuType {
  openMainMenu: boolean;
  openWalletMenu: boolean;
  openWalletSelectMenu: boolean;
  openSubMenu: keyof typeof MenuKeys;
  openSupportModal: boolean;
  openSnackbar: SnackbarProps;
  anchorRef: null | JSX.Element;
}

export const defaultMenu: DefaultMenuType = {
  openMainMenu: false,
  openWalletMenu: false,
  openWalletSelectMenu: false,
  openSubMenu: 'None',
  openSupportModal: false,
  openSnackbar: { open: false, label: undefined, severity: undefined },
  anchorRef: null,
};

export const useMenuStore = createWithEqualityFn<MenuState>(
  (set, get) => ({
    ...defaultMenu,
    setValue: (key: keyof MenuState, value: any) =>
      set(() => ({
        [key]: value,
      })),
    setValues: (values: { [x: string]: any }) =>
      set((state: MenuState) => {
        const updatedState: { [key: string]: any } = { ...state };
        for (const key in values) {
          if (Object.hasOwnProperty.call(values, key)) {
            updatedState[key] = values[key];
          }
        }
        return updatedState;
      }),

    // Close ALL Navbar Menus
    onCloseAllMenus: () => {
      set({
        openMainMenu: false,
        openWalletSelectMenu: false,
        openWalletMenu: false,
        openSubMenu: MenuKeys.None,
        openSupportModal: false,
        anchorRef: null,
      });
    },

    // Toggle Navbar Main Menu
    onOpenMainMenu: (open, anchorRef) => {
      set({
        openMainMenu: open,
        openSubMenu: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Wallet Menu
    onOpenWalletSelectMenu: (open, anchorRef) => {
      set({
        openWalletSelectMenu: open,
        openSubMenu: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Connected Menu
    onOpenWalletMenu: (open, anchorRef) => {
      set({
        openWalletMenu: open,
        openSubMenu: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Sub Menu
    onOpenSubMenu: (subMenu) => {
      set({
        openSubMenu: subMenu,
      });
    },

    // Open Snackbar and set label
    onOpenSnackbar: (open, label, severity) => {
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
    onOpenSupportModal: (open) => {
      set({
        openMainMenu: false,
        openWalletSelectMenu: false,
        openWalletMenu: false,
        openSupportModal: open,
        openSubMenu: MenuKeys.None,
      });
    },
  }),
  shallow,
);
