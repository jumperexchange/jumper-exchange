import type { Theme } from '@mui/material';
import type { ReactElement } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { HEADER_ICON_SIZE } from './constants';
import type { ProcessingTransactionCardStatus } from './types';

type StatusConfig = {
  icon: ReactElement;
  getDescriptionColor: (theme: Theme) => string;
};

export const getStatusConfig = (
  status: ProcessingTransactionCardStatus,
): StatusConfig => {
  const configs: Record<ProcessingTransactionCardStatus, StatusConfig> = {
    pending: {
      icon: (
        <WatchLaterIcon
          sx={(theme) => ({
            height: HEADER_ICON_SIZE,
            width: HEADER_ICON_SIZE,
            color: (theme.vars || theme).palette.iconHint,
          })}
        />
      ),
      getDescriptionColor: (theme) =>
        (theme.vars || theme).palette.textSecondary,
    },
    success: {
      icon: (
        <CheckIcon
          sx={(theme) => ({
            height: HEADER_ICON_SIZE,
            width: HEADER_ICON_SIZE,
            color: (theme.vars || theme).palette.statusSuccessFg,
          })}
        />
      ),
      getDescriptionColor: (theme) =>
        (theme.vars || theme).palette.statusSuccessFg,
    },
    failed: {
      icon: (
        <ErrorIcon
          sx={(theme) => ({
            height: HEADER_ICON_SIZE,
            width: HEADER_ICON_SIZE,
            color: (theme.vars || theme).palette.iconError,
          })}
        />
      ),
      getDescriptionColor: (theme) => (theme.vars || theme).palette.textError,
    },
  };

  return configs[status];
};
