import { useTranslation } from 'react-i18next';
import type { TransactionErrorType } from './types';
import type { StatusBottomSheetProps } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import type { ParseKeys } from 'i18next';

export type StatusSheetContent = Pick<
  StatusBottomSheetProps,
  | 'title'
  | 'description'
  | 'callToAction'
  | 'callToActionType'
  | 'secondaryCallToAction'
  | 'status'
  | 'onClick'
  | 'onSecondaryClick'
>;

interface ErrorKeyConfig {
  title: ParseKeys<'translation'>;
  description?: ParseKeys<'translation'>;
  action: ParseKeys<'translation'>;
  isClose?: boolean;
}

export interface TransactionStatusKeys {
  confirmation?: {
    title: ParseKeys<'translation'>;
    description?: ParseKeys<'translation'>;
    confirm: ParseKeys<'translation'>;
  };
  success: {
    title: ParseKeys<'translation'>;
    done: ParseKeys<'translation'>;
    seeDetails: ParseKeys<'translation'>;
  };
  errors: Partial<Record<TransactionErrorType, ErrorKeyConfig>>;
  defaultError: ErrorKeyConfig;
}

export interface UseTransactionStatusContentOptions {
  keys: TransactionStatusKeys;
  errorType: TransactionErrorType;
  handlers: {
    onCloseError: () => void;
    onCloseSuccess: () => void;
    onRetry: () => void;
    onViewTransaction: () => void;
    onConfirm?: () => void;
  };
}

export const useTransactionStatusContent = ({
  keys,
  errorType,
  handlers,
}: UseTransactionStatusContentOptions) => {
  const { t } = useTranslation();

  const confirmationSheetContent: StatusSheetContent | null =
    keys.confirmation && handlers.onConfirm
      ? {
          title: t(keys.confirmation.title),
          description: keys.confirmation.description
            ? t(keys.confirmation.description)
            : undefined,
          callToAction: t(keys.confirmation.confirm),
          callToActionType: 'button',
          status: 'info',
          onClick: handlers.onConfirm,
        }
      : null;

  const errorConfig = keys.errors[errorType] ?? keys.defaultError;

  const errorSheetContent: StatusSheetContent = {
    title: t(errorConfig.title),
    description: errorConfig.description
      ? t(errorConfig.description)
      : undefined,
    callToAction: t(errorConfig.action),
    callToActionType: 'button',
    status: 'error',
    onClick: errorConfig.isClose ? handlers.onCloseError : handlers.onRetry,
  };

  const successSheetContent: StatusSheetContent = {
    title: t(keys.success.title),
    callToAction: t(keys.success.done),
    callToActionType: 'button',
    secondaryCallToAction: t(keys.success.seeDetails),
    status: 'success',
    onClick: handlers.onCloseSuccess,
    onSecondaryClick: handlers.onViewTransaction,
  };

  return { confirmationSheetContent, errorSheetContent, successSheetContent };
};
