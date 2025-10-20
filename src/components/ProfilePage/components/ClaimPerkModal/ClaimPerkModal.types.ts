import { PerksDataAttributes } from 'src/types/strapi';

export enum AvailableSteps {
  Username = 'username',
  Wallet = 'wallet',
}

export interface UsernameStepProps {
  usernameType: string;
}

export interface WalletStepProps {
  // Wallet step doesn't need additional props for now
}

export interface StepProps {
  [AvailableSteps.Username]?: UsernameStepProps;
  [AvailableSteps.Wallet]?: WalletStepProps;
}

export interface BaseStepperProps {
  stepProps: StepProps;
  permittedSteps: AvailableSteps[];
  onClaim: (values: Record<string, string>) => void;
}

export interface ClaimedProps {
  walletAddress?: string;
  nextStepsDescription: PerksDataAttributes['NextStepsDescription'];
  howToUsePerkDescription: PerksDataAttributes['HowToUseDescription'];
}

export interface StepConfig {
  id: string;
  title: string;
  stepProps: Record<string, any>;
}

export interface FormState {
  values: Record<string, string>;
  activeStep: number;
  showError: boolean;
  isSubmitting: boolean;
}

export interface FormActions {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleContinue: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setActiveStep: (step: number) => void;
  resetForm: () => void;
}

export interface FormValidation {
  isCurrentStepValid: boolean;
  currentStepError: string;
  isFormValid: boolean;
}
