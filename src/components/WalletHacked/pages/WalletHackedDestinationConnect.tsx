import { useWalletMenu } from '@lifi/wallet-management';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalMenuPage } from 'src/components/WalletHacked/layout/WalletHackedLayout';
import { useWalletHacked } from '../context/WalletHackedContext';
import { useDisconnect } from '../hooks/useDisconnect';

export const WalletHackedDestinationConnect = () => {
  const { disconnectActiveWallet } = useDisconnect();
  const { t } = useTranslation();
  const { error } = useWalletHacked();
  const { openWalletMenu } = useWalletMenu();
  const hasHandledWalletConnection = useRef(false);
  const title = t('walletHacked.steps.destination.title');
  const description = t('walletHacked.steps.destination.description');
  const buttonLabel = t('walletHacked.actions.connectWallet');

  useEffect(() => {
    // disconnect any wallet on mount
    if (!hasHandledWalletConnection.current) {
      disconnectActiveWallet();
    }
  }, []);

  const handleConnectDestinationWallet = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      openWalletMenu();
    },
    [openWalletMenu],
  );

  return (
    <ModalMenuPage
      title={title}
      text={description}
      error={error}
      buttonLabel={buttonLabel}
      showPrevButton={false}
      onClickAction={handleConnectDestinationWallet}
      disabled={false}
    />
  );
};
