'use client';

import {
  Switch,
  Typography,
  TextField,
  Box,
  Collapse,
  IconButton,
  CircularProgress,
  Button,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import CloudIcon from '@mui/icons-material/Cloud';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShareStorageType } from '@/internal-wallet/crypto/types';
import {
  ADAPTER_FIELD_CONFIGS,
  adapterHasField,
} from '@/internal-wallet/recovery/adapters/ShareStorageAdapter.types';
import type {
  AdapterFields,
  AdaptersWithFields,
} from '@/internal-wallet/recovery/adapters/ShareStorageAdapter.types';
import { createAdapter } from '@/internal-wallet/recovery/adapters/adapterFactory';
import {
  MIN_SHARES,
  MIN_THRESHOLD,
} from '@/internal-wallet/hooks/useWalletSetup';
import { StepContent } from '../SignUpWizard.style';

interface RecoverySetupStepProps {
  enabledAdapters: Record<ShareStorageType, boolean>;
  adapterFields: Partial<AdapterFields>;
  threshold: number;
  onToggleAdapter: (type: ShareStorageType, enabled: boolean) => void;
  onAdapterFieldChange: <K extends AdaptersWithFields>(
    type: K,
    value: AdapterFields[K],
  ) => void;
  onThresholdChange: (threshold: number) => void;
}

const SHARE_OPTIONS: { type: ShareStorageType; icon: React.ReactNode }[] = [
  { type: 'localStorage', icon: <KeyIcon /> },
  { type: 'googleDrive', icon: <CloudIcon /> },
  { type: 'email', icon: <EmailIcon /> },
  { type: 'recoveryCode', icon: <ContentCopyIcon /> },
];

/** Adapters that are always available with no user action required. */
const ALWAYS_CONNECTED: ShareStorageType[] = ['localStorage', 'recoveryCode'];

type AdapterConnectStatus = {
  connecting: boolean;
  connected: boolean;
  error: string | null;
};

function buildInitialStatus(): Record<ShareStorageType, AdapterConnectStatus> {
  return {
    localStorage: { connecting: false, connected: true, error: null },
    recoveryCode: { connecting: false, connected: true, error: null },
    email: { connecting: false, connected: false, error: null },
    googleDrive: { connecting: false, connected: false, error: null },
  };
}

export function RecoverySetupStep({
  enabledAdapters,
  adapterFields,
  threshold,
  onToggleAdapter,
  onAdapterFieldChange,
  onThresholdChange,
}: RecoverySetupStepProps) {
  const { t } = useTranslation();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [connectStatus, setConnectStatus] =
    useState<Record<ShareStorageType, AdapterConnectStatus>>(
      buildInitialStatus,
    );

  const enabledCount = Object.values(enabledAdapters).filter(Boolean).length;

  // Keep email's connected status in sync with the field value.
  const emailConnected =
    !!adapterFields.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adapterFields.email);
  useEffect(() => {
    setConnectStatus((prev) => ({
      ...prev,
      email: { connecting: false, connected: emailConnected, error: null },
    }));
  }, [emailConnected]);

  /**
   * Call isAvailable() for the given adapter type, updating connect status.
   * Returns true on success.
   */
  const handleConnect = useCallback(
    async (type: ShareStorageType): Promise<boolean> => {
      setConnectStatus((prev) => ({
        ...prev,
        [type]: { connecting: true, connected: false, error: null },
      }));
      try {
        const available = await createAdapter(
          type,
          adapterFields,
        ).isAvailable();
        setConnectStatus((prev) => ({
          ...prev,
          [type]: {
            connecting: false,
            connected: available,
            error: available
              ? null
              : t(`jumperWallet.shares.${type}ConnectFailed`),
          },
        }));
        return available;
      } catch {
        setConnectStatus((prev) => ({
          ...prev,
          [type]: {
            connecting: false,
            connected: false,
            error: t(`jumperWallet.shares.${type}ConnectFailed`),
          },
        }));
        return false;
      }
    },
    [adapterFields, t],
  );

  /**
   * Retry connecting to an adapter. If it succeeds and the adapter was
   * toggled off (e.g. because a previous attempt failed), re-enable it.
   */
  const handleRetry = useCallback(
    async (type: ShareStorageType) => {
      const success = await handleConnect(type);
      if (success && !enabledAdapters[type]) {
        onToggleAdapter(type, true);
      }
    },
    [handleConnect, enabledAdapters, onToggleAdapter],
  );

  /**
   * Handle the toggle switch inside Advanced Setup.
   * Toggling ON triggers an availability check for adapters that need it.
   */
  const handleAdvancedToggle = useCallback(
    async (type: ShareStorageType, enabled: boolean) => {
      if (!enabled) {
        onToggleAdapter(type, false);
        // Clear any existing error so the UI resets cleanly.
        setConnectStatus((prev) => ({
          ...prev,
          [type]: { ...prev[type], error: null },
        }));
        return;
      }

      if (ALWAYS_CONNECTED.includes(type) || type === 'email') {
        onToggleAdapter(type, true);
        return;
      }

      // For adapters that need a connection step: connect first, then enable.
      const success = await handleConnect(type);
      if (success) {
        onToggleAdapter(type, true);
      }
    },
    [onToggleAdapter, handleConnect],
  );

  /** Inline status indicator shown on the right of each card. */
  const renderStatus = (type: ShareStorageType) => {
    if (type === 'email') {
      if (connectStatus.email.connected) {
        return (
          <CheckCircleOutlineIcon
            fontSize="small"
            sx={{ color: 'success.main', flexShrink: 0 }}
          />
        );
      }
      return null;
    }

    const status = connectStatus[type];

    if (status.connecting) {
      return <CircularProgress size={18} />;
    }

    if (status.connected) {
      return (
        <CheckCircleOutlineIcon
          fontSize="small"
          sx={{ color: 'success.main', flexShrink: 0 }}
        />
      );
    }

    if (status.error) {
      return (
        <Button
          size="small"
          variant="text"
          color="error"
          onClick={() => handleRetry(type)}
          sx={{ p: 0, minWidth: 0, fontSize: '0.7rem', flexShrink: 0 }}
          startIcon={<ErrorOutlineIcon fontSize="small" />}
        >
          {t('jumperWallet.shareStatus.retry')}
        </Button>
      );
    }

    // Idle (not yet connected, no error) — show a connect button.
    return (
      <Button
        size="small"
        variant="outlined"
        onClick={() => handleConnect(type)}
        sx={(theme) => ({
          whiteSpace: 'nowrap',
          fontSize: '0.75rem',
          flexShrink: 0,
          color: (theme.vars || theme).palette.text.primary,
          borderColor: (theme.vars || theme).palette.divider,
          '&:hover': {
            borderColor: (theme.vars || theme).palette.text.secondary,
            backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
            ...theme.applyStyles('light', {
              backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
            }),
          },
        })}
      >
        {t('jumperWallet.signup.connect')}
      </Button>
    );
  };

  return (
    <StepContent>
      <Typography variant="subtitle1" fontWeight={600}>
        {t('jumperWallet.signup.recoverySetup')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('jumperWallet.signup.recoverySetupDesc', {
          threshold,
          total: enabledCount,
        })}
      </Typography>

      {/* Single card list — toggles appear in-place when Advanced Setup is open */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {SHARE_OPTIONS.map((option) => {
          const isEnabled = enabledAdapters[option.type] ?? false;
          return (
            <Box key={option.type}>
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: '1.5px solid',
                  borderColor: isEnabled
                    ? (theme.vars || theme).palette.primary.main
                    : 'transparent',
                  opacity: isEnabled ? 1 : 0.6,
                  transition: 'border-color 0.2s, opacity 0.2s',
                  backgroundColor: (theme.vars || theme).palette.alphaLight200
                    .main,
                  ...theme.applyStyles('light', {
                    backgroundColor: (theme.vars || theme).palette.alphaDark200
                      .main,
                  }),
                })}
              >
                {option.icon}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {t(`jumperWallet.shares.${option.type}`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(`jumperWallet.shares.${option.type}Desc`)}
                  </Typography>
                  {adapterHasField(option.type) && (
                    <TextField
                      size="small"
                      type={
                        ADAPTER_FIELD_CONFIGS[option.type as AdaptersWithFields]
                          .inputType
                      }
                      autoComplete={
                        ADAPTER_FIELD_CONFIGS[option.type as AdaptersWithFields]
                          .autoComplete
                      }
                      name={option.type}
                      placeholder={
                        ADAPTER_FIELD_CONFIGS[option.type as AdaptersWithFields]
                          .placeholder
                      }
                      value={
                        adapterFields[option.type as AdaptersWithFields] ?? ''
                      }
                      onChange={(e) =>
                        onAdapterFieldChange(
                          option.type as AdaptersWithFields,
                          e.target.value,
                        )
                      }
                      sx={{ mt: 1 }}
                      fullWidth
                    />
                  )}
                </Box>

                {/* Status indicator + in-place toggle (only when advanced is open) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {renderStatus(option.type)}

                  {advancedOpen && (
                    <Switch
                      color="default"
                      checked={isEnabled}
                      onChange={(e) =>
                        handleAdvancedToggle(option.type, e.target.checked)
                      }
                      disabled={
                        connectStatus[option.type].connecting ||
                        (isEnabled && enabledCount <= MIN_SHARES)
                      }
                    />
                  )}
                </Box>
              </Box>

              {/* Error text below card (advanced mode only, for toggle failures) */}
              {advancedOpen && connectStatus[option.type].error && (
                <Typography
                  variant="caption"
                  color="error.main"
                  sx={{ display: 'block', px: 2, pt: 0.5 }}
                >
                  {connectStatus[option.type].error}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Footer row: shares-needed summary + Advanced Setup trigger */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography variant="caption" color="text.secondary">
            {t('jumperWallet.recovery.sharesNeeded', {
              needed: threshold,
              total: enabledCount,
            })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('jumperWallet.signup.sharesMin', { min: MIN_SHARES })}
          </Typography>
        </Box>

        <Box
          component="button"
          onClick={() => setAdvancedOpen((prev) => !prev)}
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: (theme.vars || theme).palette.text.secondary,
            '&:hover': {
              color: (theme.vars || theme).palette.text.primary,
            },
          })}
        >
          <Typography variant="caption" sx={{ color: 'inherit' }}>
            {t('jumperWallet.signup.advancedSetup')}
          </Typography>
          {advancedOpen ? (
            <ExpandLessIcon fontSize="small" sx={{ color: 'inherit' }} />
          ) : (
            <ExpandMoreIcon fontSize="small" sx={{ color: 'inherit' }} />
          )}
        </Box>
      </Box>

      {/* Advanced controls: threshold stepper revealed below the cards */}
      <Collapse in={advancedOpen}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            pt: 1.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {t('jumperWallet.signup.advancedSetupDesc')}
          </Typography>

          {/* Threshold stepper */}
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
              ...theme.applyStyles('light', {
                backgroundColor: (theme.vars || theme).palette.alphaDark200
                  .main,
              }),
            })}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {t('jumperWallet.signup.thresholdLabel')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('jumperWallet.signup.thresholdDesc')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onThresholdChange(threshold - 1)}
                disabled={threshold <= MIN_THRESHOLD}
              >
                <Typography variant="body2" fontWeight={700}>
                  −
                </Typography>
              </IconButton>
              <Typography
                variant="body2"
                fontWeight={600}
                minWidth={16}
                textAlign="center"
              >
                {threshold}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onThresholdChange(threshold + 1)}
                disabled={threshold >= enabledCount - 1}
              >
                <Typography variant="body2" fontWeight={700}>
                  +
                </Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </StepContent>
  );
}
