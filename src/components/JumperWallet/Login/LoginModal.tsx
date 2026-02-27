'use client';

import {
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import {
  ButtonPrimary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJumperWallet } from '@/internal-wallet/hooks/useJumperWallet';
import { usePasswordField } from '@/internal-wallet/hooks/usePasswordField';
import { useJumperWalletStore } from '@/stores/jumperWallet/JumperWalletStore';
import {
  ForgotPasswordLink,
  LoginContainer,
  LoginTitle,
} from './LoginModal.style';

export function LoginModal() {
  const { t } = useTranslation();
  const {
    login,
    loginWithBiometric,
    hasBiometric,
    resolveConnectRequest,
    setFlow,
  } = useJumperWallet();
  const address = useJumperWalletStore((s) => s.address);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const passwordField = usePasswordField();

  const handleLogin = useCallback(async () => {
    if (!password) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const success = await login(password);

    if (success) {
      resolveConnectRequest(address!);
      setPassword('');
    } else {
      setError(t('jumperWallet.login.wrongPassword'));
    }

    setIsLoading(false);
  }, [password, login, resolveConnectRequest, address, t]);

  const handleBiometricLogin = useCallback(async () => {
    setIsBiometricLoading(true);
    setError(null);

    const success = await loginWithBiometric();

    if (success) {
      resolveConnectRequest(address!);
    } else {
      setError(t('jumperWallet.login.biometricFailed'));
    }

    setIsBiometricLoading(false);
  }, [loginWithBiometric, resolveConnectRequest, address, t]);

  // Auto-trigger biometrics the first time hasBiometric becomes true.
  // Using a ref guard so it fires exactly once even if hasBiometric arrives
  // asynchronously (after initialize() loads the credential from IndexedDB).
  const hasAutoTriggeredRef = useRef(false);
  useEffect(() => {
    if (hasBiometric && !hasAutoTriggeredRef.current) {
      hasAutoTriggeredRef.current = true;
      handleBiometricLogin();
    }
  }, [hasBiometric, handleBiometricLogin]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    },
    [handleLogin],
  );

  const handleCancel = useCallback(() => {
    resolveConnectRequest(null);
    setFlow('idle');
    setPassword('');
    setError(null);
  }, [resolveConnectRequest, setFlow]);

  const handleForgotPassword = useCallback(() => {
    setFlow('recovery');
  }, [setFlow]);

  const isAnyLoading = isLoading || isBiometricLoading;

  return (
    <LoginContainer>
      <LoginTitle>{t('jumperWallet.login.title')}</LoginTitle>

      {hasBiometric && (
        <ButtonPrimary
          onClick={handleBiometricLogin}
          disabled={isAnyLoading}
          fullWidth
          startIcon={
            isBiometricLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FingerprintIcon />
            )
          }
        >
          {t('jumperWallet.login.biometricUnlock')}
        </ButtonPrimary>
      )}

      {hasBiometric && (
        <Divider>
          <Typography variant="caption" color="text.secondary">
            {t('jumperWallet.login.orUsePassword')}
          </Typography>
        </Divider>
      )}

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

      <ButtonPrimary
        onClick={handleLogin}
        disabled={!password || isAnyLoading}
        fullWidth
        startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
      >
        {t('jumperWallet.login.unlock')}
      </ButtonPrimary>

      <ForgotPasswordLink onClick={handleForgotPassword}>
        {t('jumperWallet.login.forgotPassword')}
      </ForgotPasswordLink>

      <ButtonTransparent onClick={handleCancel} size="small">
        {t('jumperWallet.passwordPrompt.cancel')}
      </ButtonTransparent>
    </LoginContainer>
  );
}
