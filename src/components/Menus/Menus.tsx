import type { SyntheticEvent } from 'react';
import { SupportModal } from 'src/components';
import { MainMenu, WalletMenu, WalletSelectMenu } from '.';
import { EcosystemSelectMenu } from './EcosystemSelectMenu';

export const Menus = () => {
  const handleClose = (event: Event | SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <MainMenu handleClose={handleClose} />
      <WalletMenu handleClose={handleClose} />
      <EcosystemSelectMenu handleClose={handleClose} />
      <WalletSelectMenu handleClose={handleClose} />
      <SupportModal />
    </>
  );
};
