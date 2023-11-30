import type { SyntheticEvent } from 'react';
import { SupportModal } from 'src/components';
import { useMenuStore } from 'src/stores';
import { MainMenu, WalletMenu, WalletSelectMenu } from '.';
export const Menus = () => {
  const [anchorRef] = useMenuStore((state) => [state.anchorRef]);
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
      <SupportModal />
    </>
  );
};
