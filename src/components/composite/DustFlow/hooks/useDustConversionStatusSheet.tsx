import { useTransactionStatusContent } from '@/hooks/transactions/useTransactionStatusContent';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { type JumperWidgetStatusSheetProp } from '@/components/composite/JumperWidget/types';
import { DUST_CONVERSION_STATUS_KEYS } from '../constants';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { useTranslation } from 'react-i18next';
import { type Balance, type ExtendedToken } from '@/types/tokens';
import type {
  DustPartialQuoteState,
  TransactionFormForDustStatusSheet,
} from '../types';
import { PartialQuoteErrorSheetContent } from '../components/PartialQuoteErrorSheetContent';
import type { DustChainValidationError } from '../dustComposerQuoteApi';
import { useChainDetails } from '@/hooks/chains/useChainDetails';

export const useDustConversionStatusSheet = ({
  transactionForm,
  toTokenBalance,
  partialQuoteError,
  chainValidationError,
  onPartialErrorProceed,
  onPartialErrorCancel,
  onChainValidationErrorCancel,
  onSuccess,
}: {
  transactionForm: TransactionFormForDustStatusSheet;
  toTokenBalance?: Balance<ExtendedToken>;
  partialQuoteError: DustPartialQuoteState | null;
  chainValidationError: DustChainValidationError | null;
  onPartialErrorProceed: () => void;
  onPartialErrorCancel: () => void;
  onChainValidationErrorCancel: () => void;
  onSuccess: () => void;
}) => {
  const lastOpenSheetRef = useRef<JumperWidgetStatusSheetProp | null>(null);
  const { t } = useTranslation();
  const { chain: validationErrorChain } = useChainDetails(
    chainValidationError?.chainId,
  );

  const handleCloseSuccess = useCallback(() => {
    transactionForm.handleCloseSuccess();
    onSuccess();
  }, [transactionForm.handleCloseSuccess, onSuccess]);

  const statusContent = useTransactionStatusContent({
    keys: DUST_CONVERSION_STATUS_KEYS,
    errorType: transactionForm.errorType,
    handlers: {
      onCloseError: transactionForm.handleCloseError,
      onCloseSuccess: handleCloseSuccess,
      onRetry: transactionForm.handleRetry,
      onViewTransaction: transactionForm.handleViewTransaction,
      onConfirm: transactionForm.handleConfirm,
    },
  });

  const openSheet = useMemo((): JumperWidgetStatusSheetProp | null => {
    if (chainValidationError) {
      return {
        isOpen: true,
        content: {
          title: t('portfolio.dustConversion.chainValidationError.title'),
          description: t(
            'portfolio.dustConversion.chainValidationError.description',
            {
              chain: validationErrorChain?.name ?? chainValidationError.chainId,
            },
          ),
          callToAction: t(
            'portfolio.dustConversion.chainValidationError.cancel',
          ),
          callToActionType: 'button',
          status: 'error',
          onClick: onChainValidationErrorCancel,
        },
        onClose: onChainValidationErrorCancel,
      };
    }

    if (partialQuoteError) {
      const isProceedable = partialQuoteError.proceedableBalances.length > 0;

      if (!isProceedable) {
        return {
          isOpen: true,
          content: {
            title: t('portfolio.dustConversion.partialError.title'),
            description: t(
              'portfolio.dustConversion.partialError.descriptionNotConvertible',
            ),
            callToAction: t('portfolio.dustConversion.partialError.cancel'),
            callToActionType: 'button',
            status: 'info',
            onClick: onPartialErrorCancel,
          },
          onClose: onPartialErrorCancel,
        };
      }

      return {
        isOpen: true,
        content: {
          title: t('portfolio.dustConversion.partialError.title'),
          description: t(
            'portfolio.dustConversion.partialError.descriptionPartiallyConvertible',
            {
              tokens: partialQuoteError.failedBalances
                .map((balance) => balance.token.name || balance.token.symbol)
                .join(', '),
              count: partialQuoteError.failedBalances.length,
            },
          ),
          callToAction: t('portfolio.dustConversion.partialError.proceed'),
          callToActionType: 'button',
          secondaryCallToAction: t(
            'portfolio.dustConversion.partialError.cancel',
          ),
          status: 'info',
          onClick: onPartialErrorProceed,
          onSecondaryClick: onPartialErrorCancel,
        },
        onClose: onPartialErrorCancel,
        children: (
          <PartialQuoteErrorSheetContent
            failedBalances={partialQuoteError.failedBalances}
            successfulBalances={partialQuoteError.proceedableBalances}
          />
        ),
      };
    }
    if (
      transactionForm.showConfirmationSheet &&
      statusContent.confirmationSheetContent
    ) {
      return {
        isOpen: true,
        content: statusContent.confirmationSheetContent,
        onClose: transactionForm.handleCloseSheet,
      };
    }
    if (transactionForm.showErrorBottomSheet) {
      return {
        isOpen: true,
        content: statusContent.errorSheetContent,
        onClose: transactionForm.handleCloseSheet,
      };
    }
    if (transactionForm.showSuccessSheet && toTokenBalance) {
      return {
        isOpen: true,
        content: statusContent.successSheetContent,
        onClose: handleCloseSuccess,
        children: (
          <TokenAmountInput
            label={t(`form.labels.received`)}
            tokenBalance={toTokenBalance}
            mode={SelectCardMode.Display}
            sx={(theme) => ({
              backgroundColor: (theme.vars || theme).palette.surface1.main,
              boxShadow: theme.shadows[2],
              '& .MuiInputLabel-root': {
                ...theme.typography.title2XSmall,
              },
            })}
          />
        ),
      };
    }
    return null;
  }, [
    transactionForm.showConfirmationSheet,
    transactionForm.showErrorBottomSheet,
    transactionForm.showSuccessSheet,
    transactionForm.handleCloseSheet,
    handleCloseSuccess,
    statusContent.confirmationSheetContent,
    statusContent.errorSheetContent,
    statusContent.successSheetContent,
    toTokenBalance,
    partialQuoteError,
    chainValidationError,
    validationErrorChain?.name,
    onPartialErrorProceed,
    onPartialErrorCancel,
    onChainValidationErrorCancel,
    t,
  ]);

  useEffect(() => {
    if (openSheet) {
      lastOpenSheetRef.current = openSheet;
    }
  }, [openSheet]);

  const statusSheet = useMemo(
    (): JumperWidgetStatusSheetProp =>
      openSheet ?? {
        isOpen: false,
        content: lastOpenSheetRef.current?.content ?? {
          title: '',
          callToAction: '',
          callToActionType: 'button',
        },
        onClose: transactionForm.handleCloseSheet,
      },
    [openSheet, transactionForm.handleCloseSheet],
  );

  return statusSheet;
};
