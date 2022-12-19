import React, { createContext, ReactNode, useContext, useState } from 'react';

// config
import { defaultMenu } from '@transferto/shared/src/';

// @type
import { MenuContextProps } from '@transferto/shared/src/types';

// ----------------------------------------------------------------------

const initialState: MenuContextProps = {
  ...defaultMenu,

  // CopyClipboard
  onCopyToClipboard: () => {},

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => {},

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: () => {},

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: () => {},

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: () => {},

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: () => {},
};

const MenuContext = createContext(initialState);
export const useMenu = () => useContext(MenuContext);

// ----------------------------------------------------------------------

type MenuProviderProps = {
  children: ReactNode;
};

const MenuProvider = ({ children }: MenuProviderProps) => {
  const [menu, setMenu] = useState(defaultMenu);

  // CopyToClipboard
  const onCopyToClipboard = (copied: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      copiedToClipboard: copied as boolean,
    }));
  };

  // Close ALL Navbar Menus
  const onCloseAllNavbarMenus = () => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openMainNavbarMenu: false,
      openNavbarWalletMenu: false,
      openNavbarConnectedMenu: false,
      openNavbarSubMenu: 'none',
      copiedToClipboard: false,
    }));
  };

  // Toggle Navbar Main Menu
  const onOpenNavbarMainMenu = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openMainNavbarMenu: open as boolean,
    }));
  };

  // Toggle Navbar Wallet Menu
  const onOpenNavbarWalletMenu = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      onOpenNavbarSubMenu: open ? 'wallet' : ('none' as string),
      openNavbarWalletMenu: open as boolean,
    }));
  };

  // Toggle Navbar Connected Menu
  const onOpenNavbarConnectedMenu = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openNavbarConnectedMenu: open as boolean,
    }));
  };

  // Toggle Navbar Sub Menu
  const onOpenNavbarSubMenu = (subMenu: string) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openNavbarSubMenu: subMenu as string,
    }));
  };

  return (
    <MenuContext.Provider
      value={{
        ...menu,

        // CopyToClipboard
        onCopyToClipboard,

        // Close ALL Navbar Menus
        onCloseAllNavbarMenus,

        // Toggle Navbar Main Menu
        onOpenNavbarMainMenu,

        // Toggle Navbar Wallet Menu
        onOpenNavbarWalletMenu,

        // Toggle Navbar Connected Menu
        onOpenNavbarConnectedMenu,

        // Toggle Navbar Sub Menu
        onOpenNavbarSubMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// ----------------------------------------------------------------------

export { MenuProvider, MenuContext };
