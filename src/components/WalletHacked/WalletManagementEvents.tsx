'use client';
import {
  useAccount,
  useAccountDisconnect,
  useWalletManagementEvents,
  WalletConnected,
  WalletManagementEvent,
} from '@lifi/wallet-management';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isEvmChainType } from '../Widgets/FeeContribution/utils';
import { HACKED_WALLET_DEFAULT_STATE, HACKED_WALLET_STEPS } from './constants';
import { useWalletHacked } from './context/WalletHackedContext';

export function WalletManagementEvents() {
  const walletManagementEvents = useWalletManagementEvents();
  const { account } = useAccount();
  const { t } = useTranslation();
  const disconnectWallet = useAccountDisconnect();

  const {
    currentStep,
    destinationWallet,
    setCurrentStep,
    setDestinationPoints,
    setDestinationWallet,
    setError,
    setSourceWallet,
    sourceWallet,
  } = useWalletHacked();

  const isSameWallet = (wallet1: WalletConnected, wallet2: WalletConnected) =>
    wallet1?.address === wallet2?.address;

  useEffect(() => {
    const isSourceWallet = currentStep === HACKED_WALLET_STEPS.SOURCE_CONNECT;
    const isDestinationWallet =
      currentStep === HACKED_WALLET_STEPS.DESTINATION_CONNECT;

    const onWalletConnected = async (wallet: WalletConnected) => {
      // If non-EVM wallet, set error and disconnect
      const isEvmWallet = isEvmChainType(wallet);
      if (!isEvmWallet) {
        setError(t('walletHacked.errors.nonEVMWallet'));
        return;
      }

      if (isSourceWallet) {
        setSourceWallet({
          ...HACKED_WALLET_DEFAULT_STATE,
          account: wallet,
        });

        // If no points on source wallet, set error and disconnect
        setError(undefined);
      } else if (isDestinationWallet) {
        // If no source wallet, go back to source connect first
        if (!sourceWallet?.account?.address) {
          setCurrentStep(HACKED_WALLET_STEPS.SOURCE_CONNECT);
          return;
        }

        // If same wallet as source, set error and disconnect
        if (isSameWallet(sourceWallet?.account, wallet)) {
          setError(t('walletHacked.errors.sameWalletAsSource'));
          setDestinationWallet(HACKED_WALLET_DEFAULT_STATE);
          disconnectWallet(account);
          return;
        }

        // No errors caught above, then set destination wallet and go to destination sign
        setDestinationWallet({
          ...HACKED_WALLET_DEFAULT_STATE,
          account: wallet,
        });
        setError(undefined);
        setCurrentStep(HACKED_WALLET_STEPS.DESTINATION_SIGN);
      }
    };

    walletManagementEvents.on(
      WalletManagementEvent.WalletConnected,
      onWalletConnected,
    );

    return () => {
      walletManagementEvents.off(
        WalletManagementEvent.WalletConnected,
        onWalletConnected,
      );
    };
  }, [
    walletManagementEvents,
    currentStep,
    sourceWallet,
    destinationWallet,
    setDestinationPoints,
    setSourceWallet,
    setDestinationWallet,
    setCurrentStep,
    setError,
    disconnectWallet,
    account.address,
  ]);
  return null;
}
