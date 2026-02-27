'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Typography, Box, TextField } from '@mui/material';
import {
  type ShareStatus,
  ShareStatusCard,
} from '@/components/JumperWallet/common/ShareStatusCard';
import { useTranslation } from 'react-i18next';
import type {
  ShamirShare,
  ShareStorageType,
} from '@/internal-wallet/crypto/types';
import {
  createAdapter,
  getAdapterRetrieval,
} from '@/internal-wallet/recovery/adapters/adapterFactory';
import { StepContent } from '../SignUp/SignUpWizard.style';

// ── Exported types ─────────────────────────────────────────────────────────────

export type ShareCollectionStatus = ShareStatus;

export interface RecoveryCollectionEntry {
  type: ShareStorageType;
  status: ShareCollectionStatus;
  manualValue?: string;
  error?: string;
}

interface RecoveryCollectionStepProps {
  entries: RecoveryCollectionEntry[];

  walletAddress: string;
  shamirConfig: { threshold: number; totalShares: number };
  /**
   * Called when an auto-retrieval adapter changes state.
   * `share` is populated when `status === 'done'`.
   */
  onStatusChange: (
    type: ShareStorageType,
    status: ShareCollectionStatus,
    share?: ShamirShare,
    error?: string,
  ) => void;
  /** Called whenever the user types in a manual input field. */
  onManualInput: (type: ShareStorageType, value: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse the raw string returned by an adapter into a ShamirShare.
 * Handles three formats:
 *  1. Google Drive envelope — `{ share, walletAddress, createdAt }`
 *  2. Full ShamirShare JSON — `{ data, threshold, ... }`
 *  3. Raw base64 data (LocalStorage fallback)
 */
export function parseRawShare(
  raw: string,
  shamirConfig: { threshold: number; totalShares: number },
): ShamirShare {
  try {
    const parsed = JSON.parse(raw);

    if (parsed.share !== undefined) {
      // Google Drive envelope
      return {
        data: parsed.share as string,
        threshold: shamirConfig.threshold,
        totalShares: shamirConfig.totalShares,
        v: 1,
        addr: (parsed.walletAddress as string) ?? '',
      };
    }

    if (parsed.data !== undefined && parsed.threshold !== undefined) {
      // Already a serialised ShamirShare
      return parsed as ShamirShare;
    }

    throw new Error('Unrecognised JSON share format');
  } catch {
    // Fall back: raw base64 share data (LocalStorage stores only share.data)
    return {
      data: raw,
      threshold: shamirConfig.threshold,
      totalShares: shamirConfig.totalShares,
      v: 1,
      addr: '',
    };
  }
}

/**
 * Validate a pasted share string.
 * Accepts raw base64 (both email and recoveryCode send share.data)
 * or the JSON envelope / full ShamirShare formats.
 */
function validateShareInput(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  // Try JSON-based formats first
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    // Google Drive envelope: { share: string }
    if (typeof parsed.share === 'string') {
      return isValidBase64(parsed.share);
    }
    // Full ShamirShare JSON: { data: string, threshold: number, ... }
    if (
      typeof parsed.data === 'string' &&
      typeof parsed.threshold === 'number'
    ) {
      return isValidBase64(parsed.data);
    }
    // Some other JSON — not a valid share
    return false;
  } catch {
    // Not JSON — must be raw base64
    return isValidBase64(trimmed);
  }
}

function isValidBase64(s: string): boolean {
  if (!s || s.length === 0) {
    return false;
  }
  try {
    return atob(s).length > 0;
  } catch {
    return false;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RecoveryCollectionStep({
  entries,
  walletAddress,
  shamirConfig,
  onStatusChange,
  onManualInput,
}: RecoveryCollectionStepProps) {
  const { t } = useTranslation();
  const retrievalStarted = useRef(false);

  const triggerRetrieval = useCallback(
    async (type: ShareStorageType) => {
      if (getAdapterRetrieval(type) !== 'auto') {
        return;
      }
      const adapter = createAdapter(type, {});

      onStatusChange(type, 'working');

      try {
        const rawData = await adapter.retrieve({ walletAddress });

        if (!rawData) {
          onStatusChange(
            type,
            'failed',
            undefined,
            'No share found on this device',
          );
          return;
        }

        const share = parseRawShare(rawData, shamirConfig);
        onStatusChange(type, 'done', share);
      } catch (err) {
        onStatusChange(
          type,
          'failed',
          undefined,
          err instanceof Error ? err.message : 'Retrieval failed',
        );
      }
    },
    [walletAddress, shamirConfig, onStatusChange],
  );

  // Kick off auto-retrieval for all supported adapters on mount.
  useEffect(() => {
    if (retrievalStarted.current || entries.length === 0) {
      return;
    }
    retrievalStarted.current = true;

    for (const entry of entries) {
      if (
        getAdapterRetrieval(entry.type) === 'auto' &&
        entry.status === 'idle'
      ) {
        triggerRetrieval(entry.type);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = useCallback(
    (type: ShareStorageType) => {
      triggerRetrieval(type);
    },
    [triggerRetrieval],
  );

  // Count shares that are ready (auto-retrieved OR manual with non-empty input).
  const readyCount = entries.filter((e) => {
    if (getAdapterRetrieval(e.type) === 'manual') {
      return (e.manualValue ?? '').trim().length > 0;
    }
    return e.status === 'done';
  }).length;

  return (
    <StepContent>
      <Typography variant="subtitle1" fontWeight={600}>
        {t('jumperWallet.recovery.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('jumperWallet.recovery.sharesNeeded', {
          needed: shamirConfig.threshold,
          total: entries.length,
        })}
        {' — '}
        {t('jumperWallet.recovery.sharesCollected', {
          count: readyCount,
          needed: shamirConfig.threshold,
        })}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {entries.map((entry) => {
          const isManual = getAdapterRetrieval(entry.type) === 'manual';
          const manualValue = (entry.manualValue ?? '').trim();
          const hasManualInput = isManual && manualValue.length > 0;
          const isManualValid =
            hasManualInput && validateShareInput(manualValue);

          // For manual adapters, display status is derived from the input field.
          const displayStatus: ShareCollectionStatus = isManual
            ? hasManualInput
              ? isManualValid
                ? 'done'
                : 'failed'
              : 'idle'
            : entry.status;

          return (
            <Box key={entry.type}>
              <ShareStatusCard
                type={entry.type}
                label={t(`jumperWallet.shares.${entry.type}`)}
                status={displayStatus}
                mode="retrieve"
                onRetry={
                  !isManual && entry.status === 'failed'
                    ? () => handleRetry(entry.type)
                    : undefined
                }
              />

              {entry.status === 'failed' && entry.error && !isManual && (
                <Typography
                  variant="caption"
                  color="error.main"
                  sx={{ display: 'block', pl: 2, pt: 0.5 }}
                >
                  {entry.error}
                </Typography>
              )}

              {isManual && (
                <Box sx={{ pl: 2, pr: 2 }}>
                  <TextField
                    label={
                      entry.type === 'recoveryCode'
                        ? t('jumperWallet.recovery.shareFromCode')
                        : t('jumperWallet.recovery.shareFromEmail')
                    }
                    multiline={entry.type !== 'recoveryCode'}
                    rows={entry.type !== 'recoveryCode' ? 3 : undefined}
                    value={entry.manualValue ?? ''}
                    onChange={(e) => onManualInput(entry.type, e.target.value)}
                    fullWidth
                    size="small"
                    error={hasManualInput && !isManualValid}
                    sx={{ mt: 1 }}
                    placeholder={
                      entry.type === 'recoveryCode'
                        ? t('jumperWallet.recovery.recoveryCodePlaceholder')
                        : t('jumperWallet.recovery.emailCodePlaceholder')
                    }
                  />
                  {hasManualInput && !isManualValid && (
                    <Typography
                      variant="caption"
                      color="error.main"
                      sx={{ display: 'block', pt: 0.5 }}
                    >
                      {t('jumperWallet.recovery.invalidShare')}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </StepContent>
  );
}
