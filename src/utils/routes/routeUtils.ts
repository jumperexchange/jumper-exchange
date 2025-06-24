import type {
  Estimate,
  Execution,
  LiFiStep,
  LiFiStepExtended,
} from '@lifi/sdk';

export const getDetailInformation = (
  step: LiFiStep | LiFiStepExtended,
): Execution | Estimate => {
  const isExtendedStep = 'execution' in step;
  return isExtendedStep && step.execution ? step.execution : step.estimate;
};
