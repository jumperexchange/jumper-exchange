// ----------------------------------------------------------------------

import type { MutableRefObject } from 'react';

export type MenuValueProps = {
  anchorEl: any;
  openMainNavbarMenu: boolean;
  openNavbarWalletSelectMenu: boolean;
  openNavbarChainsMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarSubMenu: string;
  openSupportModal: boolean;
};

export type MenuContextProps = {
  anchorRef?: any;
  openMainNavbarMenu?: boolean;
  openNavbarChainsMenu?: boolean;
  openNavbarWalletSelectMenu?: boolean;
  openNavbarWalletMenu?: boolean;
  openNavbarSubMenu?: string;
  openSupportModal?: boolean;

  // On Iniitialization
  onMenuInit: (
    anchorEl: JSX.Element | MutableRefObject<HTMLButtonElement>,
  ) => void;

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => void;

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: (open: boolean) => void;

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletSelectMenu: (open: boolean) => void;

  // Toggle Navbar Connected Menu
  onOpenNavbarWalletMenu: (open: boolean) => void;

  // Toggle Navbar Chains Menu
  onOpenNavbarChainsMenu: (open: boolean) => void;

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: (subMenu: string) => void;

  // Toggle support modal
  toggleSupportModal: (open: boolean) => void;
};
