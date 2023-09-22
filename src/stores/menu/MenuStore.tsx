import { MenuKeys } from 'src/const';
import type { MenuState } from 'src/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface DefaultMenuType {
  openMainPopperMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarChainsMenu: boolean;
  openNavbarWalletSelectMenu: boolean;
  openPopperSubMenu: keyof typeof MenuKeys;
  openSupportModal: boolean;
  anchorRef: null | JSX.Element;
}

export const defaultMenu: DefaultMenuType = {
  openMainPopperMenu: false,
  openNavbarWalletMenu: false,
  openNavbarChainsMenu: false,
  openNavbarWalletSelectMenu: false,
  openPopperSubMenu: 'None',
  openSupportModal: false,
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
        openMainPopperMenu: false,
        openNavbarWalletSelectMenu: false,
        openNavbarWalletMenu: false,
        openNavbarChainsMenu: false,
        openPopperSubMenu: MenuKeys.None,
        openSupportModal: false,
        anchorRef: null,
      });
    },

    // Toggle Navbar Main Menu
    onOpenNavbarMainMenu: (open, anchorRef) => {
      set({
        openMainPopperMenu: open,
        openPopperSubMenu: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Wallet Menu
    onOpenNavbarWalletSelectMenu: (open, anchorRef) => {
      set({
        openNavbarWalletSelectMenu: open,
        openPopperSubMenu: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Connected Menu
    onOpenNavbarWalletMenu: (open, anchorRef) => {
      set({
        openNavbarWalletMenu: open,
        openPopperSubMenu: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Chains Menu
    onOpenNavbarChainsMenu: (open, anchorRef) => {
      set({
        openNavbarChainsMenu: open,
        openPopperSubMenu: MenuKeys.None,
        anchorRef: open ? anchorRef : null,
      });
    },

    // Toggle Navbar Sub Menu
    onOpenPopperSubMenu: (subMenu) => {
      set({
        openPopperSubMenu: subMenu,
      });
    },

    // Toggle support modal
    onOpenSupportModal: (open) => {
      set({
        openMainPopperMenu: false,
        openNavbarChainsMenu: false,
        openNavbarWalletSelectMenu: false,
        openNavbarWalletMenu: false,
        openSupportModal: open,
        openPopperSubMenu: MenuKeys.None,
      });
    },
  }),
  shallow,
);
