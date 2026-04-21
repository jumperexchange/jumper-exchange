import { TransactionErrorType } from '@/hooks/transactions/types';
import type { TransactionStatusKeys } from '@/hooks/transactions/useTransactionStatusContent';
import type { Theme } from '@mui/material/styles';

export const BORROW_STATUS_KEYS: TransactionStatusKeys = {
  confirmation: {
    title: 'earn.requestRedeemFlow.confirmation.title',
    description: 'earn.requestRedeemFlow.confirmation.description',
    confirm: 'earn.requestRedeemFlow.confirmation.confirm',
  },
  success: {
    title: 'earn.requestRedeemFlow.success.request.title',
    done: 'earn.requestRedeemFlow.success.request.done',
    seeDetails: 'earn.requestRedeemFlow.success.request.seeDetails',
  },
  errors: {
    [TransactionErrorType.TransactionRejected]: {
      title: 'earn.requestRedeemFlow.error.transactionRejected.title',
      description:
        'earn.requestRedeemFlow.error.transactionRejected.description',
      action: 'earn.requestRedeemFlow.error.transactionRejected.tryAgain',
    },
    [TransactionErrorType.TransactionFailed]: {
      title: 'earn.requestRedeemFlow.error.transactionFailed.title',
      description: 'earn.requestRedeemFlow.error.transactionFailed.description',
      action: 'earn.requestRedeemFlow.error.transactionFailed.tryAgain',
    },
    [TransactionErrorType.InsufficientBalance]: {
      title: 'earn.requestRedeemFlow.error.insufficientBalance.title',
      description:
        'earn.requestRedeemFlow.error.insufficientBalance.description',
      action: 'earn.requestRedeemFlow.error.insufficientBalance.close',
      isClose: true,
    },
    [TransactionErrorType.FetchCallDataFailed]: {
      title: 'earn.requestRedeemFlow.error.fetchCallDataFailed.title',
      description:
        'earn.requestRedeemFlow.error.fetchCallDataFailed.description',
      action: 'earn.requestRedeemFlow.error.fetchCallDataFailed.tryAgain',
    },
    [TransactionErrorType.ChainSwitchFailed]: {
      title: 'earn.requestRedeemFlow.error.chainSwitchFailed.title',
      description: 'earn.requestRedeemFlow.error.chainSwitchFailed.description',
      action: 'earn.requestRedeemFlow.error.chainSwitchFailed.close',
      isClose: true,
    },
  },
  defaultError: {
    title: 'earn.requestRedeemFlow.error.unknown.title',
    description: 'earn.requestRedeemFlow.error.unknown.description',
    action: 'earn.requestRedeemFlow.error.unknown.tryAgain',
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
