'use client';

import { useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import CloudIcon from '@mui/icons-material/Cloud';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { ShareStorageType } from '@/internal-wallet/crypto/types';
import {
  ShareCardContainer,
  ShareCardIcon,
  ShareCardInfo,
  ShareCardLabel,
  ShareCardStatus,
} from './ShareStatusCard.style';

export type ShareStatus = 'idle' | 'working' | 'done' | 'failed';

interface ShareStatusCardProps {
  /** Which storage target this card represents */
  type: ShareStorageType;
  /** Human-readable label for the storage target */
  label: string;
  /** Current status of the share storage operation */
  status: ShareStatus;
  /** Whether this card is used in a store or retrieve context */
  mode?: 'store' | 'retrieve';
  /** Callback to retry a failed storage operation */
  onRetry?: () => void;
}

const STORE_STATUS_LABELS: Record<ShareStatus, string> = {
  idle: 'Pending',
  working: 'Saving...',
  done: 'Saved',
  failed: 'Failed',
};

const RETRIEVE_STATUS_LABELS: Record<ShareStatus, string> = {
  idle: 'Pending',
  working: 'Retrieving...',
  done: 'Retrieved',
  failed: 'Failed',
};

function ShareIcon({ type }: { type: ShareStorageType }) {
  switch (type) {
    case 'localStorage':
      return <KeyIcon fontSize="small" />;
    case 'email':
      return <EmailIcon fontSize="small" />;
    case 'googleDrive':
      return <CloudIcon fontSize="small" />;
    case 'recoveryCode':
      return <ContentCopyIcon fontSize="small" />;
    default:
      return <KeyIcon fontSize="small" />;
  }
}

export function ShareStatusCard({
  type,
  label,
  status,
  mode = 'store',
  onRetry,
}: ShareStatusCardProps) {
  const theme = useTheme();

  const statusColor = useMemo(() => {
    const palette = (theme.vars || theme).palette;
    switch (status) {
      case 'idle':
        return palette.text.disabled;
      case 'working':
        return palette.info.main;
      case 'done':
        return palette.success.main;
      case 'failed':
        return palette.error.main;
    }
  }, [status, theme]);

  const statusLabels =
    mode === 'retrieve' ? RETRIEVE_STATUS_LABELS : STORE_STATUS_LABELS;
  const statusLabel = useMemo(
    () => statusLabels[status],
    [statusLabels, status],
  );

  const handleRetry = useCallback(() => {
    onRetry?.();
  }, [onRetry]);

  return (
    <ShareCardContainer>
      <ShareCardIcon>
        {status === 'working' ? (
          <CircularProgress size={22} thickness={4} />
        ) : (
          <ShareIcon type={type} />
        )}
      </ShareCardIcon>
      <ShareCardInfo>
        <ShareCardLabel>{label}</ShareCardLabel>
        <ShareCardStatus
          statusColor={statusColor}
          isWorking={status === 'working'}
        >
          {statusLabel}
        </ShareCardStatus>
      </ShareCardInfo>
      {status === 'failed' && onRetry && (
        <IconButton size="small" onClick={handleRetry} aria-label="Retry">
          <RefreshIcon fontSize="small" />
        </IconButton>
      )}
    </ShareCardContainer>
  );
}
