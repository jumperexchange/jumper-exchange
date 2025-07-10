import { useWalletMenu } from '@lifi/wallet-management';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalMenuPage } from 'src/components/WalletHacked/layout/WalletHackedLayout';
import { useWalletHacked } from '../context/WalletHackedContext';
import { useDisconnect } from '../hooks/useDisconnect';

export const WalletHackedSourceConnect = () => {
  const { disconnectActiveWallet } = useDisconnect();
  const isInitializedRef = useRef(false);
  const { t } = useTranslation();
  const { error } = useWalletHacked();
  const { openWalletMenu } = useWalletMenu();
  const title = t('walletHacked.steps.source.title');
  const description = t('walletHacked.steps.source.description');
  const buttonLabel = t('walletHacked.actions.connectWallet');

  // disconnect any wallet on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      disconnectActiveWallet();
      isInitializedRef.current = true;
    }
  }, []);

  // Handle connect wallet
  const handleConnectSourceWallet = useCallback(
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
      buttonLabel={buttonLabel}
      error={error}
      showPrevButton={false}
      onClickAction={handleConnectSourceWallet}
      disabled={false}
    />
  );
};
