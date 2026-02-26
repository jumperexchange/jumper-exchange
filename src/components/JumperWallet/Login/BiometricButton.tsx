'use client';

import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { useTranslation } from 'react-i18next';

interface BiometricButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Biometric authentication button for the login modal.
 * Shows a fingerprint icon button when WebAuthn is registered.
 * Handles both PRF and fallback paths transparently to the user.
 */
export function BiometricButton({
  onClick,
  disabled = false,
  loading = false,
}: BiometricButtonProps) {
  const { t } = useTranslation();

  return (
    <Tooltip
      title={t('jumperWallet.login.biometricUnlock')}
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={1500}
    >
      <span>
        <IconButton
          onClick={onClick}
          disabled={disabled || loading}
          aria-label={t('jumperWallet.login.biometricUnlock')}
          sx={(theme) => ({
            width: 48,
            height: 48,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-disabled': {
              color: theme.palette.action.disabled,
              borderColor: theme.palette.action.disabledBackground,
            },
          })}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <FingerprintIcon />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
