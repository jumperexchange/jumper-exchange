'use client';

import { memo } from 'react';
import { useHackedXP } from './hooks/useHackedXP';
import { useInitializeCurrentStep } from './hooks/useInitializeCurrentStep';
import {
  WalletHackedContainer,
  WalletHackedPaper,
} from './layouts/WalletHackedStep.style';
import { WalletHackedStepperProgress } from './WalletHackedStepperProgress';

export const WalletHackedStepper = memo(() => {
  // useHackedXP needs to be called!
  const updatePoints = useHackedXP();
  const currentStepComponent = useInitializeCurrentStep();

  return (
    <WalletHackedPaper show={true} sx={{ zIndex: 1200 }}>
      <WalletHackedContainer>
        <WalletHackedStepperProgress />
        {currentStepComponent()}
      </WalletHackedContainer>
    </WalletHackedPaper>
  );
});
