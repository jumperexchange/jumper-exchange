import { TransactionErrorType } from '@/hooks/transactions/types';
import type { TransactionStatusKeys } from '@/hooks/transactions/useTransactionStatusContent';
import type { Theme } from '@mui/material/styles';

export const widgetStyle = {
  container: (theme: Theme) => ({
    maxHeight: 'calc(100vh - 6rem)',
    position: 'relative',
    borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
    // boxShadow: theme.shadows[3],
    maxWidth: 400,
    width: 400,
    [theme.breakpoints.up('md')]: {
      width: 'fit-content',
      maxWidth: 'fit-content',
    },
  }),
  mainView: (theme: Theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    [theme.breakpoints.up('md')]: { width: 400 },
  }),
  mainViewContent: () => ({
    maxHeight: 'calc(100vh - 12rem)',
    display: 'flex',
    overflow: 'hidden',
  }),
  sideView: (theme: Theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    [theme.breakpoints.up('md')]: { width: 256 },
  }),
} as const;

export const DUST_CONVERSION_STATUS_KEYS: TransactionStatusKeys = {
  success: {
    title: 'portfolio.dustConversion.success.title',
    done: 'portfolio.dustConversion.success.done',
    seeDetails: 'portfolio.dustConversion.success.seeDetails',
  },
  errors: {
    [TransactionErrorType.TransactionRejected]: {
      title: 'portfolio.dustConversion.error.transactionRejected.title',
      description:
        'portfolio.dustConversion.error.transactionRejected.description',
      action: 'portfolio.dustConversion.error.transactionRejected.tryAgain',
    },
    [TransactionErrorType.TransactionFailed]: {
      title: 'portfolio.dustConversion.error.transactionFailed.title',
      description:
        'portfolio.dustConversion.error.transactionFailed.description',
      action: 'portfolio.dustConversion.error.transactionFailed.tryAgain',
    },
    [TransactionErrorType.InsufficientBalance]: {
      title: 'portfolio.dustConversion.error.insufficientBalance.title',
      description:
        'portfolio.dustConversion.error.insufficientBalance.description',
      action: 'portfolio.dustConversion.error.insufficientBalance.close',
      isClose: true,
    },
    [TransactionErrorType.FetchCallDataFailed]: {
      title: 'portfolio.dustConversion.error.fetchCallDataFailed.title',
      description:
        'portfolio.dustConversion.error.fetchCallDataFailed.description',
      action: 'portfolio.dustConversion.error.fetchCallDataFailed.tryAgain',
    },
    [TransactionErrorType.ChainSwitchFailed]: {
      title: 'portfolio.dustConversion.error.chainSwitchFailed.title',
      description:
        'portfolio.dustConversion.error.chainSwitchFailed.description',
      action: 'portfolio.dustConversion.error.chainSwitchFailed.close',
      isClose: true,
    },
  },
  defaultError: {
    title: 'portfolio.dustConversion.error.unknown.title',
    description: 'portfolio.dustConversion.error.unknown.description',
    action: 'portfolio.dustConversion.error.unknown.tryAgain',
  },
};
