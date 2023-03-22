import { SyntheticEvent } from 'react';
import { ConnectedMenu, MainMenu, WalletMenu } from '.';
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
    menu.onCopyToClipboard(false);
  };

  return (
    <>
      <MainMenu handleClose={handleClose} />
      <WalletMenu handleClose={handleClose} />

      <ConnectedMenu handleClose={handleClose} />
    </>
  );
};
