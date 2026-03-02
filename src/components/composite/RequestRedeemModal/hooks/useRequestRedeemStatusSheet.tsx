import { useTransactionStatusContent } from '@/hooks/transactions/useTransactionStatusContent';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { type JumperWidgetStatusSheetProp } from '@/components/composite/JumperWidget/types';
import { CLAIM_STATUS_KEYS, WITHDRAW_STATUS_KEYS } from '../constants';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { useTranslation } from 'react-i18next';
import { type useTransactionForm } from '@/hooks/transactions/useTransactionForm';
import { type Balance, type ExtendedToken } from '@/types/tokens';

export const useRequestRedeemStatusSheet = ({
  transactionForm,
  isClaimFlow,
  selectedClaimToTokenBalance,
  requestWithdrawToTokenBalance,
  resetAmount,
}: {
  transactionForm: ReturnType<typeof useTransactionForm>;
  isClaimFlow: boolean;
  selectedClaimToTokenBalance: Balance<ExtendedToken>;
  requestWithdrawToTokenBalance: Balance<ExtendedToken>;
  resetAmount: () => void;
}) => {
  const lastOpenSheetRef = useRef<JumperWidgetStatusSheetProp | null>(null);
  const { t } = useTranslation();

  const handleCloseSuccess = useCallback(() => {
    transactionForm.handleCloseSuccess();
    resetAmount();
  }, [transactionForm.handleCloseSuccess, resetAmount]);

  const statusContent = useTransactionStatusContent({
    keys: isClaimFlow ? CLAIM_STATUS_KEYS : WITHDRAW_STATUS_KEYS,
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
    if (transactionForm.showSuccessSheet) {
      return {
        isOpen: true,
        content: statusContent.successSheetContent,
        onClose: handleCloseSuccess,
        children: (
          <TokenAmountInput
            label={t(`form.labels.${isClaimFlow ? 'received' : 'requested'}`)}
            tokenBalance={
              isClaimFlow
                ? selectedClaimToTokenBalance
                : requestWithdrawToTokenBalance
            }
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
    isClaimFlow,
    selectedClaimToTokenBalance,
    requestWithdrawToTokenBalance,
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
