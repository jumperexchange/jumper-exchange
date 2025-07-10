'use client';

import { useAccount, useAccountDisconnect } from '@lifi/wallet-management';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { HACKED_WALLET_DEFAULT_STATE, HACKED_WALLET_STEPS } from '../constants';
import { WalletState } from '../types';

interface WalletHackedContextType {
  currentStep: (typeof HACKED_WALLET_STEPS)[keyof typeof HACKED_WALLET_STEPS];
  setCurrentStep: (
    step: (typeof HACKED_WALLET_STEPS)[keyof typeof HACKED_WALLET_STEPS],
  ) => void;
  sourceWallet: WalletState | undefined;
  setSourceWallet: (wallet: WalletState) => void;
  sourcePoints: number | undefined;
  setSourcePoints: (points: number) => void;
  destinationPoints: number | undefined;
  setDestinationPoints: (points: number) => void;
  destinationWallet: WalletState | undefined;
  setDestinationWallet: (wallet: WalletState) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | undefined;
  setError: (error: string | undefined) => void;
}

const WalletHackedContext = createContext<WalletHackedContextType | undefined>(
  undefined,
);

export const useWalletHacked = () => {
  const context = useContext(WalletHackedContext);
  if (!context) {
    throw new Error('useWalletHacked must be used within WalletHackedProvider');
  }
  return context;
};

export const WalletHackedProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<
    (typeof HACKED_WALLET_STEPS)[keyof typeof HACKED_WALLET_STEPS]
  >(HACKED_WALLET_STEPS.INTRO);
  const [sourceWallet, setSourceWallet] = useState<WalletState | undefined>(
    undefined,
  );
  const [destinationWallet, setDestinationWallet] = useState<
    WalletState | undefined
  >(undefined);
  const [sourcePoints, setSourcePoints] = useState<number | undefined>(
    undefined,
  );
  const [destinationPoints, setDestinationPoints] = useState<
    number | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { account } = useAccount();
  const { t } = useTranslation();

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

  const disconnectWallet = useAccountDisconnect();

  // Handle source points
  useEffect(() => {
    if (
      !account ||
      !account.isConnected ||
      !isSourcePointsSuccess ||
      isSourcePointsLoading ||
      sourceWallet?.account?.address !== account.address
    )
      return;

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
  }, [
    account?.address,
    sourceWallet?.account?.address,
    isSourcePointsSuccess,
    isSourcePointsLoading,
  ]);

  // Handle destination points - Always set them when ready, regardless of value
  useEffect(() => {
    if (
      !account ||
      !account.isConnected ||
      !isDestinationPointsSuccess ||
      isDestinationPointsLoading ||
      typeof destinationPointsFetched !== 'number' ||
      destinationPointsFetched === undefined ||
      destinationWallet?.account?.address !== account.address
    )
      return;

    // Changed condition here
    setDestinationPoints(destinationPointsFetched);
  }, [
    account?.address,
    destinationWallet?.account?.address,
    isDestinationPointsSuccess,
    isDestinationPointsLoading,
  ]);

  const value = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      sourceWallet,
      setSourceWallet,
      destinationWallet,
      setDestinationWallet,
      sourcePoints,
      setSourcePoints,
      destinationPoints,
      setDestinationPoints,
      loading,
      setLoading,
      error,
      setError,
    }),
    [
      currentStep,
      setCurrentStep,
      sourceWallet,
      setSourceWallet,
      destinationWallet,
      setDestinationWallet,
      sourcePoints,
      setSourcePoints,
      destinationPoints,
      setDestinationPoints,
      loading,
      setLoading,
      error,
      setError,
    ],
  );

  return (
    <WalletHackedContext.Provider value={value}>
      {children}
    </WalletHackedContext.Provider>
  );
};
