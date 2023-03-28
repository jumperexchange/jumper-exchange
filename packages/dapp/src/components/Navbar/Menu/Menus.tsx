import { MenuContextProps } from '@transferto/shared/src/types';
import { SyntheticEvent } from 'react';
import { ConnectedMenu, MainMenu, WalletMenu } from '.';
import { useMenuStore } from '../../../stores/menu';

export const Menus = () => {
  const anchorRef = useMenuStore((state: MenuContextProps) => state.anchorRef);
  const onCopyToClipboard = useMenuStore(
    (state: MenuContextProps) => state.onCopyToClipboard,
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
