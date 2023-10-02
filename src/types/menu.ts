// ----------------------------------------------------------------------

import type { MenuKeys } from 'src/const';

export type MenuProps = {
  anchorRef: any;
  openMainMenuPopper: boolean;
  openWalletSelectPopper: boolean;
  openChainsPopper: boolean;
  openWalletPopper: boolean;
  openSubMenuPopper: keyof typeof MenuKeys;
  openSupportModal: boolean;
};

export type MenuContextProps = {
  anchorRef?: any;
  openMainMenuPopper?: boolean;
  openChainsPopper?: boolean;
  openWalletSelectPopper?: boolean;
  openWalletPopper?: boolean;
  openSubMenuPopper?: keyof typeof MenuKeys;
  openSupportModal?: boolean;
};

export interface MenuState extends MenuProps {
  // Close ALL Navbar Menus
  onCloseAllPopperMenus: () => void;

  // Toggle Navbar Main Menu
  onOpenMainMenuPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Wallet Menu
  onOpenWalletSelectPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Connected Menu
  onOpenWalletPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Chains Menu
  onOpenChainsPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Navbar Sub Menu
  onOpenSubMenuPopper: (subMenu: keyof typeof MenuKeys) => void;

  // Toggle support modal
  onOpenSupportModal: (open: boolean) => void;
}
