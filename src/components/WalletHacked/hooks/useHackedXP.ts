import { useAccount, useAccountDisconnect } from '@lifi/wallet-management';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { HACKED_WALLET_DEFAULT_STATE, HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';

interface UseHackedXPType {
  sourcePointsFetched: number | undefined;
  destinationPointsFetched: number | undefined;
  sourceWalletPointsReady: boolean;
  destinationWalletPointsReady: boolean;
}

export const useHackedXP = (): UseHackedXPType => {
  const {
    destinationWallet,
    sourceWallet,
    setCurrentStep,
    setDestinationPoints,
    setSourceWallet,
    setError,
    setSourcePoints,
  } = useWalletHacked();
  const { t } = useTranslation();
  const { account } = useAccount();
  const {
    points: sourcePointsFetched,
    isSuccess: isSourcePointsSuccess,
    isLoading: isSourcePointsLoading,
  } = useLoyaltyPass(sourceWallet?.account?.address);
  const {
    points: destinationPointsFetched,
    isSuccess: isDestinationPointsSuccess,
    isLoading: isDestinationPointsLoading,
  } = useLoyaltyPass(destinationWallet?.account?.address);
  const sourceWalletPointsReady = useMemo(
    () => isSourcePointsSuccess && !isSourcePointsLoading,
    [isSourcePointsSuccess, isSourcePointsLoading],
  );
  const destinationWalletPointsReady = useMemo(
    () => isDestinationPointsSuccess && !isDestinationPointsLoading,
    [isDestinationPointsSuccess, isDestinationPointsLoading],
  );
  const disconnectWallet = useAccountDisconnect();

  useEffect(() => {
    if (!account) return;

    // Handle destination points - Always set them when ready, regardless of value
    if (
      destinationWalletPointsReady &&
      typeof destinationPointsFetched === 'number' &&
      account.isConnected &&
      destinationWallet?.account?.address === account.address &&
      destinationPointsFetched !== undefined
    ) {
      // Changed condition here
      setDestinationPoints(destinationPointsFetched);
    }

    // Handle source points
    if (
      sourceWalletPointsReady &&
      account.isConnected &&
      sourceWallet?.account?.address === account.address
    ) {
      // Only check for positive points on source wallet
      if (
        !sourcePointsFetched ||
        !(typeof sourcePointsFetched === 'number' && sourcePointsFetched > 0)
      ) {
        disconnectWallet(account);
        const noPointsMsg = t('walletHacked.actions.noPoints');
        const tryDifferentWalletMsg = t(
          'walletHacked.actions.tryDifferentWallet',
        );
        const errorMsg = `${noPointsMsg}. ${tryDifferentWalletMsg}`;
        setError(errorMsg);
        setCurrentStep(HACKED_WALLET_STEPS.SOURCE_CONNECT);
        setSourceWallet(HACKED_WALLET_DEFAULT_STATE);
        return;
      } else {
        setSourcePoints(Number(sourcePointsFetched));
        // No errors caught above, then go to sign source wallet
        setError(undefined);
        setCurrentStep(HACKED_WALLET_STEPS.SOURCE_SIGN);
      }
    }
  }, [
    account?.address,
    destinationWallet?.account?.address,
    sourceWallet?.account?.address,
    sourceWalletPointsReady,
    destinationWalletPointsReady,
  ]);

  return {
    sourcePointsFetched,
    destinationPointsFetched,
    sourceWalletPointsReady,
    destinationWalletPointsReady,
  };
};
