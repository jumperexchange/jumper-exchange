'use client';

import {
  ModalMenuContainer,
  ModalMenuPaper,
} from '@/components/ModalMenu/ModalMenu.style';
import { memo } from 'react';
import { useHackedXP } from './hooks/useHackedXP';
import { useInitializeCurrentStep } from './hooks/useInitializeCurrentStep';
import { WalletHackedStepperProgress } from './WalletHackedStepper/WalletHackedStepperProgress';

export const WalletHackedContent = memo(() => {
  const updatePoints = useHackedXP();
  const currentStepComponent = useInitializeCurrentStep();

  return (
    <ModalMenuPaper show={true} sx={{ zIndex: 1200 }}>
      <ModalMenuContainer>
        {currentStepComponent()}
        <WalletHackedStepperProgress />
      </ModalMenuContainer>
    </ModalMenuPaper>
  );
});
