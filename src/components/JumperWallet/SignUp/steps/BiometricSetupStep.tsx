'use client';

import { Alert, Box, Typography } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import {
  ButtonPrimary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJumperWallet } from '@/internal-wallet/hooks/useJumperWallet';
import { StepContent } from '../SignUpWizard.style';

interface BiometricSetupStepProps {
  /** Wallet password — needed by registerBiometric to decrypt the mnemonic for PRF encryption */
  password: string;
  /** Called when the step is complete (either enabled or skipped) */
  onComplete: (registered: boolean) => void;
}

/**
 * Optional sign-up step that offers to register a biometric (WebAuthn) credential.
 * Only shown when the platform authenticator is available.
 * On PRF-capable devices (iOS 17+, Chrome), biometric login fully replaces the password.
 */
export function BiometricSetupStep({
  password,
  onComplete,
}: BiometricSetupStepProps) {
  const { t } = useTranslation();
  const { registerBiometric } = useJumperWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEnable = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const registered = await registerBiometric(password);

    if (registered) {
      setSuccess(true);
      // Brief pause so the user sees the success state, then advance
      setTimeout(() => onComplete(true), 800);
    } else {
      setError(t('jumperWallet.signup.biometricSetupError'));
      setIsLoading(false);
    }
  }, [password, registerBiometric, onComplete, t]);

  const handleSkip = useCallback(() => {
    onComplete(false);
  }, [onComplete]);

  const iconColor = success ? 'success.main' : 'text.primary';

  return (
    <StepContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 2,
        }}
      >
        <Box
          sx={(theme) => ({
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
            ...theme.applyStyles('light', {
              backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
            }),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <FingerprintIcon sx={{ fontSize: 40, color: iconColor }} />
        </Box>

        <Typography variant="h6" fontWeight={700} textAlign="center">
          {success
            ? t('jumperWallet.signup.biometricSetupSuccess')
            : t('jumperWallet.signup.biometricSetupTitle')}
        </Typography>

        {!success && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t('jumperWallet.signup.biometricSetupSubtitle')}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}

        {!success && (
          <>
            <ButtonPrimary
              onClick={handleEnable}
              disabled={isLoading}
              fullWidth
              startIcon={<FingerprintIcon />}
            >
              {t('jumperWallet.signup.biometricSetupEnable')}
            </ButtonPrimary>

            <ButtonTransparent onClick={handleSkip} size="small">
              {t('jumperWallet.signup.biometricSetupSkip')}
            </ButtonTransparent>
          </>
        )}
      </Box>
    </StepContent>
  );
}
