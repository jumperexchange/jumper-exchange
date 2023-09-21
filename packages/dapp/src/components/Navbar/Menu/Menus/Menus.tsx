import {
  ChainsMenu,
  MainMenu,
  SupportModal,
  WalletMenu,
  WalletSelectMenu,
} from 'components';
import { SyntheticEvent } from 'react';
import { useMenuStore } from 'stores';

export const Menus = () => {
  const anchorRef = useMenuStore((state) => state.anchorRef);

  const handleClose = (event: Event | SyntheticEvent) => {
    event.preventDefault();
    if (anchorRef.contains(event.target as HTMLElement)) {
      return;
    }
  };

  return (
    <>
      <MainMenu handleClose={handleClose} />
      <WalletMenu handleClose={handleClose} />
      <WalletSelectMenu handleClose={handleClose} />
      <ChainsMenu handleClose={handleClose} />
      <SupportModal />
    </>
  );
};
