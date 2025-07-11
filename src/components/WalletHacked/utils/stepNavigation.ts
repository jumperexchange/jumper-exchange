import { HACKED_WALLET_STEPS } from '../constants';

const HACKED_WALLET_STEP_VALUES = Object.values(HACKED_WALLET_STEPS);
export const HACKED_WALLET_STEPS_COUNT = HACKED_WALLET_STEP_VALUES.length; // 7

export const getCurrentStepIndex = (currentStep: HACKED_WALLET_STEPS) =>
  HACKED_WALLET_STEP_VALUES.indexOf(currentStep); // e.g., 2 for 'source_sign'

export const getPreviousStep = (currentStep: HACKED_WALLET_STEPS) => {
  const currentStepIndex = getCurrentStepIndex(currentStep);
  if (currentStepIndex > 0) {
    return HACKED_WALLET_STEP_VALUES[currentStepIndex - 1];
  }
  return currentStep;
};
