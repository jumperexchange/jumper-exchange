import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { ModalContainerProps } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import { useMemo, useState, type FC } from 'react';
import { useRedeemableClaims } from '@/hooks/earn/useRedeemableClaims';
import { useFormatRedeemClaimData } from './hooks/useFormatRedeemClaimData';
import { useRedeemTransactionForm } from './hooks/useRedeemTransactionForm';
import { useRedeemTransactionStatusContent } from './hooks/useRedeemTransactionStatusContent';
import { defineField } from '@/components/composite/JumperWidget/types';
import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import type { JumperWidgetStatusSheetProp } from '@/components/composite/JumperWidget/types';
import { TokenAmountInput } from '@/components/composite/TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { createTokenBalance } from '@/types/tokens';
import { useTranslation } from 'react-i18next';
import { RequestViewSubmitButton } from './components/RequestViewSubmitButton';
import { ClaimList } from './components/ClaimList';
import { RequestRedeemModalView } from './types';
import { useEarnOpportunityTokens } from './hooks/useEarnOpportunityTokens';
import {
  DisplayTokenChain,
  displayTokenChainSchema,
} from '@/components/composite/JumperWidget/components/DisplayTokenChain';
import {
  Amount,
  amountSchema,
} from '@/components/composite/JumperWidget/components/Amount';
import { Summary } from '@/components/composite/JumperWidget/components/Summary';
import { claimTokenAmountStyle, widgetStyle } from './constants';
import { ExecuteClaimSubmitButton } from './components/ExecuteClaimSubmitButton';

interface RequestRedeemModalProps extends ModalContainerProps {
  earnOpportunity: EarnOpportunityExtended;
  refetchCallback?: () => void;
}

export const RequestRedeemModal: FC<RequestRedeemModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
  refetchCallback,
}) => {
  const { t } = useTranslation();
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const { data: redeemableClaims, refetch: refetchClaims } =
    useRedeemableClaims(earnOpportunity, true);
  const formattedRedeemableClaims = useFormatRedeemClaimData(redeemableClaims);

  const selectedClaim = useMemo(
    () =>
      selectedClaimId
        ? formattedRedeemableClaims.find(
            (claim) => claim.id === selectedClaimId,
          )
        : null,
    [formattedRedeemableClaims, selectedClaimId],
  );

  const { lpToken, lpTokenAmount, assetToken } =
    useEarnOpportunityTokens(earnOpportunity);

  const transactionForm = useRedeemTransactionForm({
    earnOpportunity,
    onSuccess: () => {
      refetchClaims();
      refetchCallback?.();
    },
    config:
      selectedClaim != null
        ? {
            type: 'claim',
            claimId: selectedClaim.id,
            claimAmount: selectedClaim.assetAmount ?? '0',
          }
        : {
            type: 'request',
            initialAmount: '0',
          },
  });

  const selectedClaimFromTokenBalance = useMemo(() => {
    return createTokenBalance(
      lpToken,
      // @Note: for ethena seems we only get back the assetAmount so using that as fallback ftm
      selectedClaim?.lpTokenAmount ?? selectedClaim?.assetAmount ?? '0',
    );
  }, [lpToken, selectedClaim]);

  const selectedClaimToTokenBalance = useMemo(() => {
    return createTokenBalance(assetToken, selectedClaim?.assetAmount ?? '0');
  }, [assetToken, selectedClaim]);

  const statusContent = useRedeemTransactionStatusContent({
    transactionType: transactionForm.transactionType,
    errorType: transactionForm.errorType,
    handlers: {
      onCloseError: transactionForm.handleCloseError,
      onCloseSuccess: transactionForm.handleCloseSuccess,
      onRetry: transactionForm.handleRetry,
      onViewTransaction: transactionForm.handleViewTransaction,
      onConfirm: transactionForm.handleConfirm,
    },
  });

  const handleModalClose = () => {
    setSelectedClaimId(null);
    transactionForm.resetForm();
    onClose?.();
  };

  const requestWithdrawToTokenBalance = useMemo(() => {
    return createTokenBalance(lpToken, BigInt(transactionForm.amount ?? 0));
  }, [lpToken, transactionForm.amount]);

  const statusSheet = useMemo((): JumperWidgetStatusSheetProp => {
    if (transactionForm.showConfirmationSheet) {
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
      const isRequestFlow = transactionForm.transactionType === 'request';
      return {
        isOpen: true,
        content: statusContent.successSheetContent,
        onClose: transactionForm.handleCloseSheet,
        children: (
          <TokenAmountInput
            label={t(`form.labels.${isRequestFlow ? 'requested' : 'received'}`)}
            tokenBalance={
              isRequestFlow
                ? requestWithdrawToTokenBalance
                : selectedClaimToTokenBalance
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
    return {
      isOpen: false,
      content: {
        title: '',
        callToAction: '',
        callToActionType: 'button',
      },
      onClose: transactionForm.handleCloseSheet,
    };
  }, [
    transactionForm.showConfirmationSheet,
    transactionForm.showErrorBottomSheet,
    transactionForm.showSuccessSheet,
    transactionForm.handleCloseSheet,
    statusContent.confirmationSheetContent,
    statusContent.errorSheetContent,
    statusContent.successSheetContent,
    selectedClaimToTokenBalance,
    requestWithdrawToTokenBalance,
    selectedClaim,
    t,
  ]);

  const requestWithdrawFields = useMemo(
    () => [
      defineField({
        fieldKey: 'requestAmount',
        schema: amountSchema,
        defaultValue: {
          amount: '0',
          maxAmount: lpTokenAmount?.toString(),
        },
        FieldComponent: Amount,
        fieldProps: {
          token: lpToken,
          label: t('form.labels.amount'),
        },
      }),
      defineField({
        fieldKey: 'withdrawTo',
        schema: displayTokenChainSchema,
        defaultValue: assetToken,
        FieldComponent: DisplayTokenChain,
        fieldProps: {
          label: t('form.labels.withdrawTo'),
        },
      }),
    ],
    [assetToken, lpToken, lpTokenAmount, t],
  );

  const views = useMemo(
    () => [
      {
        id: RequestRedeemModalView.REQUEST_WITHDRAW,
        type: 'form' as const,
        title: t('earn.requestRedeemFlow.title.request'),
        fields: requestWithdrawFields,
        content: (
          <ClaimList
            claims={formattedRedeemableClaims}
            setSelectedClaimId={setSelectedClaimId}
            fromToken={lpToken}
            toToken={assetToken}
          />
        ),
        actions: (
          <RequestViewSubmitButton
            isFormSubmitting={transactionForm.isSubmitting}
          />
        ),
        onSubmit: transactionForm.handleSubmit,
      },
      {
        id: RequestRedeemModalView.CLAIM_REDEEM,
        type: 'custom' as const,
        title: t('earn.requestRedeemFlow.title.claim'),
        content:
          !!selectedClaimFromTokenBalance && !!selectedClaimToTokenBalance ? (
            <Summary
              from={selectedClaimFromTokenBalance}
              to={selectedClaimToTokenBalance}
              label={t('form.labels.swap')}
              fieldSx={claimTokenAmountStyle}
            />
          ) : null,
        actions: (
          <ExecuteClaimSubmitButton
            isFormSubmitting={transactionForm.isSubmitting}
          />
        ),
        onSubmit: transactionForm.handleSubmit,
      },
    ],
    [
      requestWithdrawFields,
      transactionForm.handleSubmit,
      transactionForm.isSubmitting,
      formattedRedeemableClaims,
      lpToken,
      assetToken,
      selectedClaimFromTokenBalance,
      selectedClaimToTokenBalance,
      t,
    ],
  );

  return (
    <ModalContainer isOpen={isOpen} onClose={handleModalClose}>
      {isOpen ? (
        <JumperWidget
          views={views}
          statusSheet={statusSheet}
          style={widgetStyle}
        />
      ) : null}
    </ModalContainer>
  );
};
