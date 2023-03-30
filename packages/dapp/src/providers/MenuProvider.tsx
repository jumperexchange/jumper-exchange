import { MenuContextProps } from '@transferto/shared/src';
import { useState } from 'react';
import { createContainer } from 'react-tracked';
import { SubMenuKeys } from '../const/subMenuKeys';

interface defaultMenuType {
  copiedToClipboard: boolean;
  openMainNavbarMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarConnectedMenu: boolean;
  openNavbarSubMenu: string;
  openSupportModal: boolean;
  anchorEl: null | JSX.Element;
}

export const defaultMenu: defaultMenuType = {
  copiedToClipboard: false,
  openMainNavbarMenu: false,
  openNavbarWalletMenu: false,
  openNavbarConnectedMenu: false,
  openNavbarSubMenu: SubMenuKeys.none,
  openSupportModal: false,
  anchorEl: null,
};

const initialState: MenuContextProps = {
  ...defaultMenu,
  // CopyClipboard
  onCopyToClipboard: () => {},

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => {},

  // On Initialization of Menu
  onMenuInit: () => {},

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: () => {},

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: () => {},

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: () => {},

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: () => {},

  // Toggle support modal
  toggleSupportModal: () => {},
};

export const useMenu = () => useState(initialState);

export const { Provider: MenuProvider, useTracked: useSharedMenu } =
  createContainer(useMenu);
