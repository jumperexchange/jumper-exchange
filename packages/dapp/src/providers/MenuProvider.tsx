import { createContext, ReactNode, useContext, useState } from 'react';

// config
import { defaultMenu } from '@transferto/shared/src/';
import { SubMenuKeys } from '../const';
// @type
import { MenuContextProps } from '@transferto/shared/src/types';

// ----------------------------------------------------------------------

const initialState: MenuContextProps = {
  ...defaultMenu,

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => {},

  // On Initialization of Menu
  onMenuInit: () => {},

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: () => {},

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: () => {},

  // Toggle Navbar Chains Menu
  onOpenNavbarChainsMenu: () => {},

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: () => {},

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: () => {},

  // Toggle support modal
  toggleSupportModal: () => {},
};

const MenuContext = createContext(initialState);
export const useMenu = () => useContext(MenuContext);

// ----------------------------------------------------------------------

type MenuProviderProps = {
  children: ReactNode;
};

const MenuProvider = ({ children }: MenuProviderProps) => {
  const [menu, setMenu] = useState(defaultMenu);

  // Close ALL Navbar Menus
  const onCloseAllNavbarMenus = () => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openMainNavbarMenu: false,
      openNavbarWalletMenu: false,
      openNavbarConnectedMenu: false,
      openNavbarChainsMenu: false,
      openNavbarSubMenu: SubMenuKeys.none,
    }));
  };

  // Set AnchorElement on Initialization of Navbar
  const onMenuInit = (anchorRef: JSX.Element) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      anchorRef: anchorRef,
    }));
  };

  // Toggle Navbar Main Menu
  const onOpenNavbarMainMenu = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openMainNavbarMenu: open,
    }));
  };

  // Toggle Navbar Wallet Menu
  const onOpenNavbarWalletMenu = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openNavbarSubMenu: open ? SubMenuKeys.wallets : SubMenuKeys.none,
      openNavbarWalletMenu: open,
    }));
  };

  // Toggle Navbar Chains Menu
  const onOpenNavbarChainsMenu = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openNavbarSubMenu: open ? SubMenuKeys.chains : SubMenuKeys.none,
      openNavbarChainsMenu: open,
    }));
  };

  // Toggle Navbar Connected Menu
  const onOpenNavbarConnectedMenu = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openNavbarConnectedMenu: open,
      openNavbarSubMenu: open ? SubMenuKeys.connected : SubMenuKeys.none,
    }));
  };

  // Toggle Navbar Sub Menu
  const onOpenNavbarSubMenu = (subMenu: string) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openNavbarSubMenu: subMenu,
    }));
  };

  // Toggle support modal
  const toggleSupportModal = (open: boolean) => {
    setMenu((oldSettings) => ({
      ...oldSettings,
      openMainNavbarMenu: false,
      openSupportModal: open,
    }));
  };

  return (
    <MenuContext.Provider
      value={{
        ...menu,

        // Close ALL Navbar Menus
        onCloseAllNavbarMenus,

        // On Initialization of Menu
        onMenuInit,

        // Toggle Navbar Main Menu
        onOpenNavbarMainMenu,

        // Toggle Navbar Wallet Menu
        onOpenNavbarWalletMenu,

        // Toggle Navbar Wallet Menu
        onOpenNavbarChainsMenu,

        // Toggle Navbar Connected Menu
        onOpenNavbarConnectedMenu,

        // Toggle Navbar Sub Menu
        onOpenNavbarSubMenu,

        // Toggle support modal
        toggleSupportModal,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// ----------------------------------------------------------------------

export { MenuProvider, MenuContext };
