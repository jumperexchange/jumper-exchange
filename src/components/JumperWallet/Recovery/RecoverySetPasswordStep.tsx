'use client';

import { Alert, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PasswordCreationFields } from '../common/PasswordCreationFields';
import { StepContent } from '../SignUp/SignUpWizard.style';

interface RecoverySetPasswordStepProps {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  recoveredAddress?: string;
}

export function RecoverySetPasswordStep({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  recoveredAddress,
}: RecoverySetPasswordStepProps) {
  const { t } = useTranslation();

  return (
    <StepContent>
      <Typography variant="body2" color="text.secondary">
        {t('jumperWallet.recovery.setNewPassword')}
      </Typography>

      {recoveredAddress && (
        <Alert severity="success">Recovered address: {recoveredAddress}</Alert>
      )}

      <PasswordCreationFields
        password={newPassword}
        confirmPassword={confirmPassword}
        onPasswordChange={onNewPasswordChange}
        onConfirmPasswordChange={onConfirmPasswordChange}
      />
    </StepContent>
  );
}
