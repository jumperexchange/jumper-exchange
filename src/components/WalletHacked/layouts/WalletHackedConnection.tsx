import { useWalletMenu } from '@lifi/wallet-management';
import { useCallback, useEffect, useRef } from 'react';
import { ModalMenuPage } from 'src/components/WalletHacked/layouts/WalletHackedLayout';
import { useWalletHacked } from '../context/WalletHackedContext';
import { useDisconnect } from '../hooks/useDisconnect';

interface WalletHackedConnectionProps {
  title: string;
  description: string;
  buttonLabel: string;
}

export const WalletHackedConnection = ({
  title,
  description,
  buttonLabel,
}: WalletHackedConnectionProps) => {
  const { disconnectActiveWallet } = useDisconnect();
  const isInitializedRef = useRef(false);
  const { error } = useWalletHacked();
  const { openWalletMenu } = useWalletMenu();

  useEffect(() => {
    // disconnect any wallet on mount
    if (!isInitializedRef.current) {
      disconnectActiveWallet();
    }
  }, []);

  const handleWalletMenu = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      openWalletMenu();
    },
    [openWalletMenu],
  );

  return (
    <ModalMenuPage
      buttonLabel={buttonLabel}
      error={error}
      disabled={false}
      onClickAction={handleWalletMenu}
      title={title}
      text={description}
    />
  );
};
