import { MenuKeys } from 'src/const';
import type { MenuState, SnackbarProps } from 'src/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface DefaultMenuType {
  openMainMenuPopper: boolean;
  openWalletPopper: boolean;
  openChainsPopper: boolean;
  openWalletSelectPopper: boolean;
  openSubMenuPopper: keyof typeof MenuKeys;
  openSupportModal: boolean;
  openSnackbar: SnackbarProps;
  anchorRef: null | JSX.Element;
}

export const defaultMenu: DefaultMenuType = {
  openMainMenuPopper: false,
  openWalletPopper: false,
  openChainsPopper: false,
  openWalletSelectPopper: false,
  openSubMenuPopper: 'None',
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
    onCloseAllPopperMenus: () => {
      set({
        openMainMenuPopper: false,
        openWalletSelectPopper: false,
        openWalletPopper: false,
        openChainsPopper: false,
        openSubMenuPopper: MenuKeys.None,
        openSupportModal: false,
        anchorRef: null,
      });
    },

    // Toggle Navbar Main Menu
    onOpenMainMenuPopper: (open, anchorRef) => {
      set({
        openMainMenuPopper: open,
        openSubMenuPopper: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Wallet Menu
    onOpenWalletSelectPopper: (open, anchorRef) => {
      set({
        openWalletSelectPopper: open,
        openSubMenuPopper: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Connected Menu
    onOpenWalletPopper: (open, anchorRef) => {
      set({
        openWalletPopper: open,
        openSubMenuPopper: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Chains Menu
    onOpenChainsPopper: (open, anchorRef) => {
      set({
        openChainsPopper: open,
        openSubMenuPopper: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Sub Menu
    onOpenSubMenuPopper: (subMenu) => {
      set({
        openSubMenuPopper: subMenu,
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
        openMainMenuPopper: false,
        openChainsPopper: false,
        openWalletSelectPopper: false,
        openWalletPopper: false,
        openSupportModal: open,
        openSubMenuPopper: MenuKeys.None,
      });
    },
  }),
  shallow,
);
