'use client';

import { memo } from 'react';
import { useHackedXP } from './hooks/useHackedXP';
import { useInitializeCurrentStep } from './hooks/useInitializeCurrentStep';
import {
  WalletHackedContainer,
  WalletHackedPaper,
} from './layouts/WalletHackedLayout.style';
import { WalletHackedStepperProgress } from './WalletHackedStepper/WalletHackedStepperProgress';

export const WalletHackedContent = memo(() => {
  // useHackedXP needs to be called!
  const updatePoints = useHackedXP();
  const currentStepComponent = useInitializeCurrentStep();

  return (
    <WalletHackedPaper show={true} sx={{ zIndex: 1200 }}>
      <WalletHackedContainer>
        {currentStepComponent()}
        <WalletHackedStepperProgress />
      </WalletHackedContainer>
    </WalletHackedPaper>
  );
});
