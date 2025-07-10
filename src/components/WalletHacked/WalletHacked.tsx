'use client';

import { WalletManagementEvents } from '../Widgets/WalletManagementEvents';
import { WalletHackedProvider } from './context/WalletHackedContext';
import { WalletHackedContent } from './WalletHackedContent';

interface WalletHackedProps {
  onClose?: () => void;
}

export const WalletHacked = ({ onClose = () => {} }: WalletHackedProps) => {
  return (
    <>
      <WalletHackedProvider onClose={onClose}>
        <WalletHackedContent />
        <WalletManagementEvents />
      </WalletHackedProvider>
    </>
  );
};
