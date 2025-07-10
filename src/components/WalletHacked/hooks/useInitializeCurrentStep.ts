import React, { FC } from 'react';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';
import { WalletHackedDestinationConnect } from '../pages/WalletHackedDestinationConnect';
import { WalletHackedDestinationSign } from '../pages/WalletHackedDestinationSign';
import { WalletHackedIntro } from '../pages/WalletHackedIntro';
import { WalletHackedSourceConnect } from '../pages/WalletHackedSourceConnect';
import { WalletHackedSourceSign } from '../pages/WalletHackedSourceSign';
import { WalletHackedSuccess } from '../pages/WalletHackedSuccess';
import { WalletHackedSummary } from '../pages/WalletHackedSummary';

type StepComponent = FC<Record<string, never>>;

export const useInitializeCurrentStep = (): (() => React.ReactElement) => {
  const { currentStep } = useWalletHacked();

  return () => {
    const components: Record<HACKED_WALLET_STEPS, StepComponent> = {
      [HACKED_WALLET_STEPS.INTRO]: WalletHackedIntro,
      [HACKED_WALLET_STEPS.SOURCE_CONNECT]: WalletHackedSourceConnect,
      [HACKED_WALLET_STEPS.SOURCE_SIGN]: WalletHackedSourceSign,
      [HACKED_WALLET_STEPS.DESTINATION_CONNECT]: WalletHackedDestinationConnect,
      [HACKED_WALLET_STEPS.DESTINATION_SIGN]: WalletHackedDestinationSign,
      [HACKED_WALLET_STEPS.SUMMARY]: WalletHackedSummary,
      [HACKED_WALLET_STEPS.SUCCESS]: WalletHackedSuccess,
    };
    const Component = components[currentStep];
    return React.createElement(Component);
  };
};
