import { useEffect, useState } from 'react';
import { useMenuStore } from '../stores';

export const usePopperIsOpened = () => {
  const [popperOpened, setPopperOpened] = useState<boolean>();
  const [
    openMainNavbarMenu,
    openNavbarWalletMenu,
    openNavbarSubMenu,
    openNavbarChainsMenu,
    openNavbarWalletSelectMenu,
  ] = useMenuStore((state) => [
    state.openMainNavbarMenu,
    state.openNavbarWalletMenu,
    state.openNavbarSubMenu,
    state.openNavbarChainsMenu,
    state.openNavbarWalletSelectMenu,
  ]);

  useEffect(() => {
    setPopperOpened(
      openMainNavbarMenu ||
        openNavbarWalletMenu ||
        openNavbarSubMenu !== 'None' ||
        openNavbarChainsMenu ||
        openNavbarWalletSelectMenu,
    );
  }, [
    openMainNavbarMenu,
    openNavbarChainsMenu,
    openNavbarSubMenu,
    openNavbarWalletMenu,
    openNavbarWalletSelectMenu,
  ]);

  return popperOpened;
};
