'use client';

import {
  Switch,
  Typography,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import CloudIcon from '@mui/icons-material/Cloud';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useJumperWalletStore } from '@/stores/jumperWallet/JumperWalletStore';
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
import { StepContent } from '../SignUpWizard.style';

interface RecoverySetupStepProps {
  enabledAdapters: Record<ShareStorageType, boolean>;
  adapterFields: Partial<AdapterFields>;
  onToggleAdapter: (type: ShareStorageType, enabled: boolean) => void;
  onAdapterFieldChange: <K extends AdaptersWithFields>(
    type: K,
    value: AdapterFields[K],
  ) => void;
}

const SHARE_OPTIONS: { type: ShareStorageType; icon: React.ReactNode }[] = [
  { type: 'localStorage', icon: <KeyIcon /> },
  { type: 'email', icon: <EmailIcon /> },
  { type: 'googleDrive', icon: <CloudIcon /> },
  { type: 'recoveryCode', icon: <ContentCopyIcon /> },
];

type AdapterToggleState = { connecting: boolean; error: string | null };

function AdapterFieldInput({
  type,
  adapterFields,
  onAdapterFieldChange,
}: {
  type: AdaptersWithFields;
  adapterFields: Partial<AdapterFields>;
  onAdapterFieldChange: <K extends AdaptersWithFields>(
    type: K,
    value: AdapterFields[K],
  ) => void;
}) {
  const config = ADAPTER_FIELD_CONFIGS[type];
  return (
    <TextField
      size="small"
      type={config.inputType}
      placeholder={config.placeholder}
      value={adapterFields[type] ?? ''}
      onChange={(e) => onAdapterFieldChange(type, e.target.value)}
      sx={{ mt: 1 }}
      fullWidth
    />
  );
}

export function RecoverySetupStep({
  enabledAdapters,
  adapterFields,
  onToggleAdapter,
  onAdapterFieldChange,
}: RecoverySetupStepProps) {
  const { t } = useTranslation();
  const shamirConfig = useJumperWalletStore((s) => s.shamirConfig);
  const [toggleState, setToggleState] = useState<
    Partial<Record<ShareStorageType, AdapterToggleState>>
  >({});

  const enabledCount = Object.values(enabledAdapters).filter(Boolean).length;

  const handleToggle = useCallback(
    async (type: ShareStorageType, enabled: boolean) => {
      if (enabled) {
        setToggleState((prev) => ({
          ...prev,
          [type]: { connecting: true, error: null },
        }));
        try {
          const available = await createAdapter(
            type,
            adapterFields,
          ).isAvailable();
          if (available) {
            onToggleAdapter(type, true);
            setToggleState((prev) => ({
              ...prev,
              [type]: { connecting: false, error: null },
            }));
          } else {
            setToggleState((prev) => ({
              ...prev,
              [type]: {
                connecting: false,
                error: t(`jumperWallet.shares.${type}ConnectFailed`),
              },
            }));
          }
        } catch {
          setToggleState((prev) => ({
            ...prev,
            [type]: {
              connecting: false,
              error: t(`jumperWallet.shares.${type}ConnectFailed`),
            },
          }));
        }
      } else {
        setToggleState((prev) => ({
          ...prev,
          [type]: { connecting: false, error: null },
        }));
        onToggleAdapter(type, enabled);
      }
    },
    [onToggleAdapter, adapterFields, t],
  );

  return (
    <StepContent>
      <Typography variant="subtitle1" fontWeight={600}>
        {t('jumperWallet.signup.recoverySetup')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('jumperWallet.signup.recoveryDesc', {
          threshold: shamirConfig.threshold,
          total: shamirConfig.totalShares,
        })}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {SHARE_OPTIONS.map((option) => (
          <Box key={option.type}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'action.hover',
              }}
            >
              {option.icon}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {t(`jumperWallet.shares.${option.type}`)}
                </Typography>
                {adapterHasField(option.type) &&
                  enabledAdapters[option.type] && (
                    <AdapterFieldInput
                      type={option.type}
                      adapterFields={adapterFields}
                      onAdapterFieldChange={onAdapterFieldChange}
                    />
                  )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {toggleState[option.type]?.connecting && (
                  <CircularProgress size={16} />
                )}
                <Switch
                  checked={enabledAdapters[option.type] ?? false}
                  onChange={(e) => handleToggle(option.type, e.target.checked)}
                  disabled={
                    (toggleState[option.type]?.connecting ?? false) ||
                    (enabledAdapters[option.type] &&
                      enabledCount <= shamirConfig.threshold)
                  }
                />
              </Box>
            </Box>
            {toggleState[option.type]?.error && (
              <Typography
                variant="caption"
                color="error.main"
                sx={{ display: 'block', px: 2, pt: 0.5 }}
              >
                {toggleState[option.type]?.error}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary">
        {t('jumperWallet.recovery.sharesNeeded', {
          needed: shamirConfig.threshold,
          total: enabledCount,
        })}
      </Typography>
    </StepContent>
  );
}
