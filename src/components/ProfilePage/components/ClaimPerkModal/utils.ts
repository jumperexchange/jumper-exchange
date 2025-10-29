/**
 * Get the position key for translation based on current step and total steps
 */
export const getStepPositionKey = (
  currentStep: number,
  totalSteps: number,
): 'first' | 'next' | 'finally' => {
  if (currentStep === 1) {
    return 'first';
  }
  if (currentStep === totalSteps && totalSteps > 2) {
    return 'finally';
  }
  return 'next';
};
