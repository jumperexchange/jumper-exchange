import { SyntheticEvent } from 'react';
import { shallow } from 'zustand/shallow';
import { ChainsMenu, MainMenu, WalletMenu, WalletSelectMenu } from '.';
import { useMenuStore } from '../../../stores/menu';
import { SupportModal } from '../../SupportModal';

export const Menus = () => {
  const [anchorRef] = useMenuStore((state) => [state.anchorRef], shallow);

  const handleClose = (event: Event | SyntheticEvent) => {
    event.preventDefault();
    if (anchorRef && anchorRef.contains(event.target as HTMLElement)) {
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
