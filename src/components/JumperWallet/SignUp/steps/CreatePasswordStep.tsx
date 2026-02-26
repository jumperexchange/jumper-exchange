'use client';

import { Alert } from '@mui/material';
import { PasswordCreationFields } from '../../common/PasswordCreationFields';
import { StepContent } from '../SignUpWizard.style';

interface CreatePasswordStepProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  error: string | null;
}

export function CreatePasswordStep({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  error,
}: CreatePasswordStepProps) {
  return (
    <StepContent>
      <PasswordCreationFields
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={onPasswordChange}
        onConfirmPasswordChange={onConfirmPasswordChange}
      />

      {error && <Alert severity="error">{error}</Alert>}
    </StepContent>
  );
}
