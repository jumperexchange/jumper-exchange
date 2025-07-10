'use client';

import { WalletHackedProvider } from './context/WalletHackedContext';
import { WalletHackedStepper } from './WalletHackedStepper';

export const WalletHacked = () => {
  return (
    <WalletHackedProvider>
      <WalletHackedStepper />
    </WalletHackedProvider>
  );
};
