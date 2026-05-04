import { TransactionErrorType } from '@/hooks/transactions/types';
import type { TransactionStatusKeys } from '@/hooks/transactions/useTransactionStatusContent';
import type { Theme } from '@mui/material/styles';

export const BORROW_STATUS_KEYS: TransactionStatusKeys = {
  confirmation: {
    title: 'earn.leverageFlow.confirmation.title',
    description: 'earn.leverageFlow.confirmation.description',
    confirm: 'earn.leverageFlow.confirmation.confirm',
  },
  success: {
    title: 'earn.leverageFlow.success.title',
    done: 'earn.leverageFlow.success.done',
    seeDetails: 'earn.leverageFlow.success.seeDetails',
  },
  errors: {
    [TransactionErrorType.TransactionRejected]: {
      title: 'earn.leverageFlow.error.transactionRejected.title',
      description: 'earn.leverageFlow.error.transactionRejected.description',
      action: 'earn.leverageFlow.error.transactionRejected.tryAgain',
    },
    [TransactionErrorType.TransactionFailed]: {
      title: 'earn.leverageFlow.error.transactionFailed.title',
      description: 'earn.leverageFlow.error.transactionFailed.description',
      action: 'earn.leverageFlow.error.transactionFailed.tryAgain',
    },
    [TransactionErrorType.InsufficientBalance]: {
      title: 'earn.leverageFlow.error.insufficientBalance.title',
      description: 'earn.leverageFlow.error.insufficientBalance.description',
      action: 'earn.leverageFlow.error.insufficientBalance.close',
      isClose: true,
    },
    [TransactionErrorType.FetchCallDataFailed]: {
      title: 'earn.leverageFlow.error.fetchCallDataFailed.title',
      description: 'earn.leverageFlow.error.fetchCallDataFailed.description',
      action: 'earn.leverageFlow.error.fetchCallDataFailed.tryAgain',
    },
    [TransactionErrorType.ChainSwitchFailed]: {
      title: 'earn.leverageFlow.error.chainSwitchFailed.title',
      description: 'earn.leverageFlow.error.chainSwitchFailed.description',
      action: 'earn.leverageFlow.error.chainSwitchFailed.close',
      isClose: true,
    },
  },
  defaultError: {
    title: 'earn.leverageFlow.error.unknown.title',
    description: 'earn.leverageFlow.error.unknown.description',
    action: 'earn.leverageFlow.error.unknown.tryAgain',
  },
};

export const widgetStyle = {
  container: (theme: Theme) => ({
    maxHeight: 'calc(100vh - 6rem)',
    position: 'relative',
    borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
  }),
  mainView: (theme: Theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: { width: 400 },
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
