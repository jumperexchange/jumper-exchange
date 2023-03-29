import { MenuContextProps } from '@transferto/shared/src';
import { defaultMenu } from '@transferto/shared/src/config';
import { useState } from 'react';
import { createContainer } from 'react-tracked';

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
