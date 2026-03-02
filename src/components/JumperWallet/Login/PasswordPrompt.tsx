'use client';

import {
  TextField,
  Alert,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import {
  ButtonPrimary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJumperWallet } from '@/internal-wallet/hooks/useJumperWallet';
import { usePasswordField } from '@/internal-wallet/hooks/usePasswordField';
import { BiometricButton } from './BiometricButton';

/**
 * Password re-prompt modal for signing operations.
 * Triggered when the wagmi connector needs to sign a transaction
 * and the wallet is locked.
 */
export function PasswordPrompt() {
  const { t } = useTranslation();
  const { unlock, resolvePasswordRequest, unlockWithBiometric, hasBiometric } =
    useJumperWallet();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const passwordField = usePasswordField();

  const handleConfirm = useCallback(async () => {
    if (!password) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const success = await unlock(password);

    if (success) {
      resolvePasswordRequest(password);
      setPassword('');
    } else {
      setError(t('jumperWallet.login.wrongPassword'));
    }

    setIsLoading(false);
  }, [password, unlock, resolvePasswordRequest, t]);

  const handleBiometricUnlock = useCallback(async () => {
    setIsBiometricLoading(true);
    setError(null);
    const success = await unlockWithBiometric();
    if (!success) {
      setError(t('jumperWallet.login.biometricFailed'));
    }
    setIsBiometricLoading(false);
  }, [unlockWithBiometric, t]);

  const handleCancel = useCallback(() => {
    resolvePasswordRequest(null);
    setPassword('');
    setError(null);
  }, [resolvePasswordRequest]);

  const hasAutoTriggeredRef = useRef(false);
  useEffect(() => {
    if (hasBiometric && !hasAutoTriggeredRef.current) {
      hasAutoTriggeredRef.current = true;
      handleBiometricUnlock();
    }
  }, [hasBiometric, handleBiometricUnlock]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleConfirm();
    },
    [handleConfirm],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleConfirm();
      }
    },
    [handleConfirm],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
        maxWidth: 400,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Typography variant="h6" fontWeight={700} textAlign="center">
        {t('jumperWallet.passwordPrompt.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {t('jumperWallet.passwordPrompt.description')}
      </Typography>

      {hasBiometric && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <BiometricButton
              onClick={handleBiometricUnlock}
              loading={isBiometricLoading}
              disabled={isLoading}
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            {t('jumperWallet.login.orUsePassword')}
          </Typography>
        </>
      )}

      <form onSubmit={handleFormSubmit} style={{ display: 'contents' }}>
        <TextField
          {...passwordField}
          label={t('jumperWallet.login.enterPassword')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          error={!!error}
          name="password"
          autoComplete="current-password"
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <ButtonTransparent
            type="button"
            onClick={handleCancel}
            sx={{ flex: 1 }}
          >
            {t('jumperWallet.passwordPrompt.cancel')}
          </ButtonTransparent>
          <ButtonPrimary
            type="submit"
            disabled={!password || isLoading}
            sx={{ flex: 1 }}
            startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
          >
            {t('jumperWallet.passwordPrompt.confirm')}
          </ButtonPrimary>
        </Box>
      </form>
    </Box>
  );
}
