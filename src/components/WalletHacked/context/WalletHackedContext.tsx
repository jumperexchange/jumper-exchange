'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { HACKED_WALLET_STEPS } from '../constants';
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

interface WalletHackedProviderProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const WalletHackedProvider: React.FC<WalletHackedProviderProps> = ({
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
