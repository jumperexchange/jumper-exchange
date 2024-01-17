import { SupportModal } from 'src/components';
import { MainMenu, WalletMenu, WalletSelectMenu } from '.';
import { EcosystemSelectMenu } from './EcosystemSelectMenu';

export const Menus = () => {
  return (
    <>
      <MainMenu />
      <WalletMenu />
      <EcosystemSelectMenu />
      <WalletSelectMenu />
      <SupportModal />
    </>
  );
};
