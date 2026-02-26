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
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJumperWallet } from '@/internal-wallet/hooks/useJumperWallet';
import { usePasswordField } from '@/internal-wallet/hooks/usePasswordField';

/**
 * Password re-prompt modal for signing operations.
 * Triggered when the wagmi connector needs to sign a transaction
 * and the wallet is locked.
 */
export function PasswordPrompt() {
  const { t } = useTranslation();
  const { unlock, resolvePasswordRequest } = useJumperWallet();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleCancel = useCallback(() => {
    resolvePasswordRequest(null);
    setPassword('');
    setError(null);
  }, [resolvePasswordRequest]);

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

      <TextField
        {...passwordField}
        label={t('jumperWallet.login.enterPassword')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        error={!!error}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <ButtonTransparent onClick={handleCancel} sx={{ flex: 1 }}>
          {t('jumperWallet.passwordPrompt.cancel')}
        </ButtonTransparent>
        <ButtonPrimary
          onClick={handleConfirm}
          disabled={!password || isLoading}
          sx={{ flex: 1 }}
          startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
        >
          {t('jumperWallet.passwordPrompt.confirm')}
        </ButtonPrimary>
      </Box>
    </Box>
  );
}
