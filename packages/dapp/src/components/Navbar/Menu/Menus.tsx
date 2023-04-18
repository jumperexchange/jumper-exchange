import { SyntheticEvent } from 'react';
import { ChainsMenu, ConnectedMenu, MainMenu, WalletSelectMenu } from '.';
import { useMenu } from '../../../providers/MenuProvider';

export const Menus = () => {
  const menu = useMenu();

  const handleClose = (event: Event | SyntheticEvent) => {
    event.preventDefault();
    if (
      menu.anchorRef.current &&
      menu.anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
  };

  return (
    <>
      <MainMenu handleClose={handleClose} />
      <WalletSelectMenu handleClose={handleClose} />
      <ChainsMenu handleClose={handleClose} />
      <ConnectedMenu handleClose={handleClose} />
    </>
  );
};
