'use client';

import { memo } from 'react';
import { useInitializeCurrentStep } from './hooks/useInitializeCurrentStep';
import {
  WalletHackedContainer,
  WalletHackedPaper,
} from './layouts/WalletHackedStep.style';
import { WalletHackedStepperProgress } from './WalletHackedStepperProgress';

export const WalletHackedStepper = memo(() => {
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
