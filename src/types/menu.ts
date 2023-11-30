// ----------------------------------------------------------------------

import type { MenuKeys } from 'src/const';

type SnackbarSeverityType = 'error' | 'warning' | 'info' | 'success';

export interface SnackbarProps {
  open: boolean;
  label?: string;
  severity?: SnackbarSeverityType | undefined;
}

export type MenuProps = {
  anchorRef: any;
  openMainMenu: boolean;
  openWalletSelectMenu: boolean;
  openWalletMenu: boolean;
  openSubMenu: keyof typeof MenuKeys;
  openSnackbar: SnackbarProps;
  openSupportModal: boolean;
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
