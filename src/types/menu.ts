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
  openMainMenuPopper: boolean;
  openWalletSelectPopper: boolean;
  openChainsPopper: boolean;
  openWalletPopper: boolean;
  openSubMenuPopper: keyof typeof MenuKeys;
  openSnackbar: SnackbarProps;
  openSupportModal: boolean;
};

export interface MenuState extends MenuProps {
  // Close ALL Navbar Menus
  onCloseAllPopperMenus: () => void;

  // Toggle Main Menu
  onOpenMainMenuPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Wallet Menu
  onOpenWalletPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Wallet Selection Menu
  onOpenWalletSelectPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Chains Menu
  onOpenChainsPopper: (open: boolean, anchorRef?: any) => void;

  // Toggle Sub Menu
  onOpenSubMenuPopper: (subMenu: keyof typeof MenuKeys) => void;

  // Open Snackbar and set label
  onOpenSnackbar: (
    open: boolean,
    label?: string,
    severity?: SnackbarSeverityType,
  ) => void;

  // Toggle support modal
  onOpenSupportModal: (open: boolean) => void;
}
