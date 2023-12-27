import type { CombinedWallet } from './../hooks/useCombinedWallets';
// ----------------------------------------------------------------------

import type { MenuKeys } from 'src/const';

type SnackbarSeverityType = 'error' | 'warning' | 'info' | 'success';

export interface SnackbarProps {
  open: boolean;
  label?: string;
  severity?: SnackbarSeverityType | undefined;
}

export interface EcosystemSelectMenuProps {
  open: boolean;
  combinedWallet?: CombinedWallet;
}

export type MenuProps = {
  anchorRef: any;
  openMainMenu: boolean;
  openWalletSelectMenu: boolean;
  openWalletMenu: boolean;
  openSubMenu: keyof typeof MenuKeys;
  openSnackbar: SnackbarProps;
  openSupportModal: boolean;
  openEcosystemSelect: EcosystemSelectMenuProps;
};

export interface MenuState extends MenuProps {
  // Close ALL Navbar Menus
  onCloseAllMenus: () => void;

  // Toggle Main Menu
  onOpenMainMenu: (open: boolean, anchorRef?: any) => void;

  // Toggle Wallet Menu
  onOpenWalletMenu: (open: boolean, anchorRef?: any) => void;

  // Toggle Wallet Selection Menu
  onOpenWalletSelectMenu: (open: boolean, anchorRef?: any) => void;

  // Toggle Ecosystem Select Menu
  onOpenEcosystemSelectMenu: (
    open: boolean,
    combinedWallet?: CombinedWallet,
    anchorRef?: any,
  ) => void;

  // Toggle Sub Menu
  onOpenSubMenu: (subMenu: keyof typeof MenuKeys) => void;

  // Open Snackbar and set label
  onOpenSnackbar: (
    open: boolean,
    label?: string,
    severity?: SnackbarSeverityType,
  ) => void;

  // Toggle support modal
  onOpenSupportModal: (open: boolean) => void;
}
