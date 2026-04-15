import { useTransactionStatusContent } from '@/hooks/transactions/useTransactionStatusContent';
import { useEffect, useMemo, useRef } from 'react';
import { type JumperWidgetStatusSheetProp } from '@/components/composite/JumperWidget/types';
import { DUST_CONVERSION_STATUS_KEYS } from '../constants';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { useTranslation } from 'react-i18next';
import { type useTransactionForm } from '@/hooks/transactions/useTransactionForm';
import { type Balance, type ExtendedToken } from '@/types/tokens';

export const useDustConversionStatusSheet = ({
  transactionForm,
  toTokenBalance,
}: {
  transactionForm: ReturnType<typeof useTransactionForm>;
  toTokenBalance?: Balance<ExtendedToken>;
}) => {
  const lastOpenSheetRef = useRef<JumperWidgetStatusSheetProp | null>(null);
  const { t } = useTranslation();

  const statusContent = useTransactionStatusContent({
    keys: DUST_CONVERSION_STATUS_KEYS,
    errorType: transactionForm.errorType,
    handlers: {
      onCloseError: transactionForm.handleCloseError,
      onCloseSuccess: transactionForm.handleCloseSuccess,
      onRetry: transactionForm.handleRetry,
      onViewTransaction: transactionForm.handleViewTransaction,
      onConfirm: transactionForm.handleConfirm,
    },
  });

  const openSheet = useMemo((): JumperWidgetStatusSheetProp | null => {
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
        onClose: transactionForm.handleCloseSheet,
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
    statusContent.confirmationSheetContent,
    statusContent.errorSheetContent,
    statusContent.successSheetContent,
    toTokenBalance,
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
