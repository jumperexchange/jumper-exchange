import { useMenuStore } from '@transferto/dapp/src/stores/menu';
import { SyntheticEvent } from 'react';
import { ChainsMenu, MainMenu, WalletMenu, WalletSelectMenu } from '.';
import { SupportModal } from '../../SupportModal';

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
