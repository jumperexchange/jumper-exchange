import { FC } from 'react';
import { AvailableSteps } from '../../ClaimPerkModal.types';
import { UsernameStepContent } from './UsernameStepContent';
import { WalletStepContent } from './WalletStepContent';
import { SignatureRequiredContent } from './SignatureRequiredContent';

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
  isMultiStep?: boolean;
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
  isMultiStep,
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
        />
      );

    case AvailableSteps.Wallet:
      return (
        <WalletStepContent
          value={value}
          onChange={onChange}
          isSubmitting={isSubmitting}
          isMultiStep={isMultiStep}
        />
      );

    case 'error':
      return <SignatureRequiredContent />;

    default:
      return null;
  }
};
