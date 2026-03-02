'use client';

import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePasswordField } from '@/internal-wallet/hooks/usePasswordField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

const PasswordFieldsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

interface PasswordCreationFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export function PasswordCreationFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}: PasswordCreationFieldsProps) {
  const { t } = useTranslation();
  const passwordField = usePasswordField();

  const passwordScore = useMemo(() => {
    if (!password) {
      return 0;
    }
    let score = 0;
    if (password.length >= 12) {
      score++;
    }
    if (/[A-Z]/.test(password)) {
      score++;
    }
    if (/[0-9]/.test(password)) {
      score++;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    const labels = [
      t('jumperWallet.passwordStrength.weak'),
      t('jumperWallet.passwordStrength.fair'),
      t('jumperWallet.passwordStrength.good'),
      t('jumperWallet.passwordStrength.strong'),
      t('jumperWallet.passwordStrength.veryStrong'),
    ];
    return labels[passwordScore] ?? labels[0];
  }, [passwordScore, t]);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onPasswordChange(e.target.value);
    },
    [onPasswordChange],
  );

  const handleConfirmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onConfirmPasswordChange(e.target.value);
    },
    [onConfirmPasswordChange],
  );

  return (
    <PasswordFieldsContainer>
      <TextField
        {...passwordField}
        label={t('jumperWallet.signup.createPassword')}
        value={password}
        onChange={handlePasswordChange}
        fullWidth
        helperText={t('jumperWallet.signup.passwordRequirements')}
        name="new-password"
        autoComplete="new-password"
      />

      {password && (
        <PasswordStrengthMeter score={passwordScore} label={strengthLabel} />
      )}

      <TextField
        {...passwordField}
        label={t('jumperWallet.signup.confirmPassword')}
        value={confirmPassword}
        onChange={handleConfirmChange}
        fullWidth
        error={mismatch}
        helperText={
          mismatch ? t('jumperWallet.signup.passwordMismatch') : undefined
        }
        name="confirm-password"
        autoComplete="new-password"
      />
    </PasswordFieldsContainer>
  );
}
