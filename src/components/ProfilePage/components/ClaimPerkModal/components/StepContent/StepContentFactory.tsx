import { FC } from 'react';
import { AvailableSteps } from '../../ClaimPerkModal.types';
import { UsernameStepContent } from './UsernameStepContent';
import { WalletStepContent } from './WalletStepContent';
import { SignatureRequiredContent } from './SignatureRequiredContent';
import { EmailStepContent } from './EmailStepContent';

export interface StepContentProps {
  stepId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  errorMessage?: string;
  isSubmitting: boolean;
  stepProps: Record<string, any>;
}

interface StepContentFactoryProps extends StepContentProps {
  stepType: AvailableSteps | 'error';
  currentStep: number;
  totalSteps: number;
}

export const StepContentFactory: FC<StepContentFactoryProps> = ({
  stepType,
  stepId,
  value,
  onChange,
  onContinue,
  errorMessage,
  isSubmitting,
  stepProps,
  currentStep,
  totalSteps,
}) => {
  switch (stepType) {
    case AvailableSteps.Username:
      return (
        <UsernameStepContent
          usernameType={stepProps.usernameType}
          value={value}
          id={stepId}
          onChange={onChange}
          onContinue={onContinue}
          errorMessage={errorMessage}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );

    case AvailableSteps.Email:
      return (
        <EmailStepContent
          value={value}
          id={stepId}
          onChange={onChange}
          onContinue={onContinue}
          errorMessage={errorMessage}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );

    case AvailableSteps.Wallet:
      return (
        <WalletStepContent
          value={value}
          onChange={onChange}
          isSubmitting={isSubmitting}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );

    case 'error':
      return <SignatureRequiredContent />;

    default:
      return null;
  }
};
