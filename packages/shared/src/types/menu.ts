// ----------------------------------------------------------------------

import type { MenuKeys } from '@transferto/dapp/src/const';

export type MenuProps = {
  anchorRef: any;
  openMainNavbarMenu: boolean;
  openNavbarWalletSelectMenu: boolean;
  openNavbarChainsMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarSubMenu: keyof typeof MenuKeys;
  openSupportModal: boolean;
};

export type MenuContextProps = {
  anchorRef?: any;
  openMainNavbarMenu?: boolean;
  openNavbarChainsMenu?: boolean;
  openNavbarWalletSelectMenu?: boolean;
  openNavbarWalletMenu?: boolean;
  openNavbarSubMenu?: keyof typeof MenuKeys;
  openSupportModal?: boolean;
};

export interface MenuState extends MenuProps {
  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => void;

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletSelectMenu: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Connected Menu
  onOpenNavbarWalletMenu: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Chains Menu
  onOpenNavbarChainsMenu: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: (subMenu: keyof typeof MenuKeys) => void;

  // Toggle support modal
  onOpenSupportModal: (open: boolean) => void;
}
