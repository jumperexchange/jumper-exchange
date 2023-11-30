import { useMenuStore } from '../stores';

export const useMenuIsOpened = () => {
  const [openMainMenu, openWalletMenu, openSubMenu, openWalletSelectMenu] =
    useMenuStore((state) => [
      state.openMainMenu,
      state.openWalletMenu,
      state.openSubMenu,
      state.openWalletSelectMenu,
    ]);

  return (
    openMainMenu ||
    openWalletMenu ||
    openSubMenu !== 'None' ||
    openWalletSelectMenu
  );
};
