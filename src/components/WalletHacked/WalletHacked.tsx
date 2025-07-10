'use client';

import { WalletHackedProvider } from './context/WalletHackedContext';
import { WalletHackedStepper } from './WalletHackedStepper';
import { WalletManagementEvents } from './WalletManagementEvents';

export const WalletHacked = () => {
  return (
    <>
      <WalletHackedProvider>
        <WalletHackedStepper />
        <WalletManagementEvents />
      </WalletHackedProvider>
    </>
  );
};
