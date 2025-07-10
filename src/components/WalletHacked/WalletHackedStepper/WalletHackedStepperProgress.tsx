import MobileStepper from '@mui/material/MobileStepper';
import { useWalletHacked } from '../context/WalletHackedContext';
import {
  getCurrentStepIndex,
  HACKED_WALLET_STEPS_COUNT,
} from '../utils/stepNavigation';

export const WalletHackedStepperProgress = () => {
  const { currentStep } = useWalletHacked();

  return (
    <MobileStepper
      variant="progress"
      steps={HACKED_WALLET_STEPS_COUNT}
      position="static"
      activeStep={getCurrentStepIndex(currentStep)}
      sx={{ width: '100%', flexGrow: 1 }}
      backButton={<></>}
      nextButton={<></>}
      slotProps={{
        progress: {
          sx: { width: '100%', flexGrow: 1 },
        },
      }}
    />
  );
};
