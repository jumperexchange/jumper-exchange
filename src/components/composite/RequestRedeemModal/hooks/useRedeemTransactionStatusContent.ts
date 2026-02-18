import { useTranslation } from 'react-i18next';
import { RequestRedeemErrorType } from '../types';
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

interface ErrorConfig {
  titleKey: ParseKeys<'translation'>;
  descriptionKey?: ParseKeys<'translation'>;
  actionKey: ParseKeys<'translation'>;
  onClick?: () => void;
}

const ERROR_CONFIGS: Record<RequestRedeemErrorType, ErrorConfig> = {
  [RequestRedeemErrorType.TransactionRejected]: {
    titleKey: 'earn.requestRedeemFlow.error.transactionRejected.title',
    descriptionKey:
      'earn.requestRedeemFlow.error.transactionRejected.description',
    actionKey: 'earn.requestRedeemFlow.error.transactionRejected.tryAgain',
  },
  [RequestRedeemErrorType.TransactionFailed]: {
    titleKey: 'earn.requestRedeemFlow.error.transactionFailed.title',
    descriptionKey:
      'earn.requestRedeemFlow.error.transactionFailed.description',
    actionKey: 'earn.requestRedeemFlow.error.transactionFailed.tryAgain',
  },
  [RequestRedeemErrorType.InsufficientBalance]: {
    titleKey: 'earn.requestRedeemFlow.error.insufficientBalance.title',
    descriptionKey:
      'earn.requestRedeemFlow.error.insufficientBalance.description',
    actionKey: 'earn.requestRedeemFlow.error.insufficientBalance.close',
  },
  [RequestRedeemErrorType.NetworkError]: {
    titleKey: 'earn.requestRedeemFlow.error.unknown.title',
    descriptionKey: 'earn.requestRedeemFlow.error.unknown.description',
    actionKey: 'earn.requestRedeemFlow.error.unknown.tryAgain',
  },
  [RequestRedeemErrorType.FetchCallDataFailed]: {
    titleKey: 'earn.requestRedeemFlow.error.fetchCallDataFailed.title',
    descriptionKey:
      'earn.requestRedeemFlow.error.fetchCallDataFailed.description',
    actionKey: 'earn.requestRedeemFlow.error.fetchCallDataFailed.tryAgain',
  },
  [RequestRedeemErrorType.ChainSwitchFailed]: {
    titleKey: 'earn.requestRedeemFlow.error.chainSwitchFailed.title',
    descriptionKey:
      'earn.requestRedeemFlow.error.chainSwitchFailed.description',
    actionKey: 'earn.requestRedeemFlow.error.chainSwitchFailed.close',
  },
  [RequestRedeemErrorType.Unknown]: {
    titleKey: 'earn.requestRedeemFlow.error.unknown.title',
    descriptionKey: 'earn.requestRedeemFlow.error.unknown.description',
    actionKey: 'earn.requestRedeemFlow.error.unknown.tryAgain',
  },
};

export interface UseRedeemTxStatusContentOptions {
  transactionType: 'request' | 'claim';
  errorType: RequestRedeemErrorType;
  handlers: {
    onCloseError: () => void;
    onCloseSuccess: () => void;
    onRetry: () => void;
    onViewTransaction: () => void;
    onConfirm?: () => void; // Only for request type
  };
}

export const useRedeemTransactionStatusContent = ({
  transactionType,
  errorType,
  handlers,
}: UseRedeemTxStatusContentOptions) => {
  const { t } = useTranslation();

  const confirmationSheetContent: StatusSheetContent = {
    title: t('earn.requestRedeemFlow.confirmation.title'),
    description: t('earn.requestRedeemFlow.confirmation.description'),
    callToAction: t('earn.requestRedeemFlow.confirmation.confirm'),
    callToActionType: 'button' as const,
    status: 'info' as const,
    onClick: handlers.onConfirm,
  };

  const getErrorSheetContent = (): StatusSheetContent => {
    const config = ERROR_CONFIGS[errorType];

    // Determine the appropriate handler based on the action key
    const shouldClose = config.actionKey?.includes('close');
    const onClick = shouldClose ? handlers.onCloseError : handlers.onRetry;

    return {
      title: t(config.titleKey),
      description: config.descriptionKey ? t(config.descriptionKey) : undefined,
      callToAction: t(config.actionKey),
      callToActionType: 'button' as const,
      status: 'error' as const,
      onClick,
    };
  };

  const getSuccessSheetContent = (): StatusSheetContent => {
    if (transactionType === 'request') {
      return {
        title: t('earn.requestRedeemFlow.success.request.title'),
        callToAction: t('earn.requestRedeemFlow.success.request.done'),
        callToActionType: 'button' as const,
        secondaryCallToAction: t(
          'earn.requestRedeemFlow.success.request.seeDetails',
        ),
        status: 'success' as const,
        onClick: handlers.onCloseSuccess,
        onSecondaryClick: handlers.onViewTransaction,
      };
    } else {
      return {
        title: t('earn.requestRedeemFlow.success.claim.title'),
        callToAction: t('earn.requestRedeemFlow.success.claim.done'),
        callToActionType: 'button' as const,
        secondaryCallToAction: t(
          'earn.requestRedeemFlow.success.claim.seeDetails',
        ),
        status: 'success' as const,
        onClick: handlers.onCloseSuccess,
        onSecondaryClick: handlers.onViewTransaction,
      };
    }
  };

  return {
    confirmationSheetContent,
    errorSheetContent: getErrorSheetContent(),
    successSheetContent: getSuccessSheetContent(),
  };
};
