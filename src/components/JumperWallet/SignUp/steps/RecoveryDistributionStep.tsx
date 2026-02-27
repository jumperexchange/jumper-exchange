'use client';

import { Typography, Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ShareStatusCard } from '@/components/JumperWallet/common/ShareStatusCard';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  ShamirShare,
  ShareStorageType,
} from '@/internal-wallet/crypto/types';
import type {
  ShareDistributionEntry,
  ShareDistributionStatus,
} from '@/internal-wallet/hooks/useWalletSetup';
import type { AdapterFields } from '@/internal-wallet/recovery/adapters/ShareStorageAdapter.types';
import { createAdapter } from '@/internal-wallet/recovery/adapters/adapterFactory';
import { StepContent } from '../SignUpWizard.style';

interface RecoveryDistributionStepProps {
  shares: ShamirShare[];
  address: `0x${string}` | null;
  distribution: ShareDistributionEntry[];
  adapterFields: Partial<AdapterFields>;
  onStatusChange: (
    type: ShareStorageType,
    status: ShareDistributionStatus,
    error?: string,
  ) => void;
}

export function RecoveryDistributionStep({
  shares,
  address,
  distribution,
  adapterFields,
  onStatusChange,
}: RecoveryDistributionStepProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const distributionStarted = useRef(false);

  const distributeShare = useCallback(
    async (type: ShareStorageType, shareIndex: number) => {
      const share = shares[shareIndex];
      if (!share || !address) {
        onStatusChange(type, 'failed', 'Missing share or address');
        return;
      }

      onStatusChange(type, 'working');

      try {
        const adapter = createAdapter(type, adapterFields);
        const success = await adapter.store(share.data, {
          walletAddress: address,
          createdAt: Date.now(),
        });

        onStatusChange(
          type,
          success ? 'done' : 'failed',
          success ? undefined : 'Storage failed',
        );
      } catch (err) {
        onStatusChange(
          type,
          'failed',
          err instanceof Error ? err.message : 'Unknown error',
        );
      }
    },
    [shares, address, adapterFields, onStatusChange],
  );

  // Kick off distribution for all non-recoveryCode adapters on mount
  useEffect(() => {
    if (distributionStarted.current || distribution.length === 0 || !address) {
      return;
    }
    distributionStarted.current = true;

    distribution.forEach((entry, i) => {
      // recoveryCode doesn't need automatic distribution — it's shown in the UI
      if (entry.type === 'recoveryCode') {
        onStatusChange('recoveryCode', 'done');
        return;
      }
      distributeShare(entry.type, i);
    });
  }, [distribution, address, distributeShare, onStatusChange]);

  const handleRetry = useCallback(
    (type: ShareStorageType) => {
      const idx = distribution.findIndex((d) => d.type === type);
      if (idx >= 0) {
        distributeShare(type, idx);
      }
    },
    [distribution, distributeShare],
  );

  // Find the share data assigned to the recoveryCode adapter
  const recoveryCodeIdx = distribution.findIndex(
    (d) => d.type === 'recoveryCode',
  );
  const recoveryCodeShare =
    recoveryCodeIdx >= 0 ? shares[recoveryCodeIdx] : null;

  const handleCopy = useCallback(async () => {
    if (recoveryCodeShare) {
      await navigator.clipboard.writeText(recoveryCodeShare.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [recoveryCodeShare]);

  return (
    <StepContent>
      <Typography variant="subtitle1" fontWeight={600}>
        {t('jumperWallet.signup.distributing')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {distribution.map((entry) => (
          <Box key={entry.type}>
            <ShareStatusCard
              type={entry.type}
              label={t(`jumperWallet.shares.${entry.type}`)}
              status={entry.status}
              onRetry={
                entry.status === 'failed'
                  ? () => handleRetry(entry.type)
                  : undefined
              }
            />

            {/* Show copy UI for recovery code */}
            {entry.type === 'recoveryCode' && recoveryCodeShare && (
              <Box sx={{ pl: 2, pr: 2 }}>
                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                    border: '1px dashed',
                    borderColor: 'divider',
                  }}
                >
                  {recoveryCodeShare.data}
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopy}
                  sx={{ mt: 1 }}
                >
                  {copied
                    ? t('jumperWallet.shareStatus.copied')
                    : t('jumperWallet.shareStatus.copy')}
                </Button>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </StepContent>
  );
}
