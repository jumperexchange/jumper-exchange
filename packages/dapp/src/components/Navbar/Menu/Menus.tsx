import { MenuContextProps } from '@transferto/shared/src/types';
import { SyntheticEvent } from 'react';
import { shallow } from 'zustand/shallow';
import { ConnectedMenu, MainMenu, WalletMenu } from '.';
import { useMenuStore } from '../../../stores/menu';

export const Menus = () => {
  const [anchorRef, onCopyToClipboard] = useMenuStore(
    (state: MenuContextProps) => [state.anchorRef, state.onCopyToClipboard],
    shallow,
  );

  const handleClose = (event: Event | SyntheticEvent) => {
    event.preventDefault();
    if (anchorRef && anchorRef.contains(event.target as HTMLElement)) {
      return;
    }
    onCopyToClipboard(false);
  };

  return (
    <>
      <MainMenu handleClose={handleClose} />
      <WalletMenu handleClose={handleClose} />
      <ConnectedMenu handleClose={handleClose} />
    </>
  );
};
