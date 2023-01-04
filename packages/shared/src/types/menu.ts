// ----------------------------------------------------------------------

export type MenuValueProps = {
  copiedToClipboard: boolean;
  openMainNavbarMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarConnectedMenu: boolean;
  openNavbarSubMenu: string;
  openSupportModal: boolean;
};

export type MenuContextProps = {
  copiedToClipboard?: boolean;
  openMainNavbarMenu?: boolean;
  openNavbarWalletMenu?: boolean;
  openNavbarConnectedMenu?: boolean;
  openNavbarSubMenu?: string;
  openSupportModal?: boolean;

  // ClipBoard
  onCopyToClipboard: (copied: boolean) => void;

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => void;

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: (open: boolean) => void;

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: (open: boolean) => void;

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: (open: boolean) => void;

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: (subMenu: string) => void;

  // Toggle support modal
  toggleSupportModal: (open: boolean) => {};
};
