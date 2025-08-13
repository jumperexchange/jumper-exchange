import dynamic from 'next/dynamic';

import { useIsDisconnected } from '../../hooks';
import ConnectButton from './ConnectButton';
import { LevelButton } from './LevelButton';

const WalletMenuToggle = dynamic(
  () => import('./WalletMenuToggle').then((mod) => mod.WalletMenuToggle),
  {
    ssr: false,
  },
);

export const WalletButtons = () => {
  const isDisconnected = useIsDisconnected();

  return isDisconnected ? (
    <ConnectButton />
  ) : (
    <>
      <LevelButton />
      <WalletMenuToggle />
    </>
  );
};
