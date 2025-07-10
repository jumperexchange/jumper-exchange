'use client';

import { WalletHackedProvider } from './context/WalletHackedContext';
import { WalletHackedContent } from './WalletHackedContent';
import { WalletManagementEvents } from './WalletManagementEvents';

export const WalletHacked = () => {
  return (
    <>
      <WalletHackedProvider>
        <WalletHackedContent />
        <WalletManagementEvents />
      </WalletHackedProvider>
    </>
  );
};
