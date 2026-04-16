import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { ModalContainerProps } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import { useMemo, useState, useCallback, type FC } from 'react';
import { useRedeemableClaims } from '@/hooks/earn/useRedeemableClaims';
import { useFormatRedeemClaimData } from './hooks/useFormatRedeemClaimData';
import { useTransactionForm } from '@/hooks/transactions/useTransactionForm';
import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import { createTokenBalance } from '@/types/tokens';
import { useTranslation } from 'react-i18next';
import { RequestViewSubmitButton } from './components/RequestViewSubmitButton';
import { ClaimList } from './components/ClaimList';
import { RequestRedeemModalView } from './types';
import { useEarnOpportunityTokens } from './hooks/useEarnOpportunityTokens';
import { Summary } from '@/components/composite/JumperWidget/components/Summary';
import { claimTokenAmountStyle, widgetStyle } from './constants';
import { ExecuteClaimSubmitButton } from './components/ExecuteClaimSubmitButton';
import {
  defineAmountField,
  defineDisplayTokenChainField,
} from '@/components/composite/JumperWidget/utils';
import { makeClient } from '@/app/lib/client';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import type { Hex } from 'viem';
import type { AmountValue } from '@/components/composite/JumperWidget/components/Amount';
import type { ViewSubmitContext } from '@/components/composite/JumperWidget/types';
import { useRequestRedeemStatusSheet } from './hooks/useRequestRedeemStatusSheet';

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
  const accountAddress = useAccountAddress();

  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [amount, setAmount] = useState('0');

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

  const { lpToken, lpTokenAmount, assetToken, refetchLpTokenAmount } =
    useEarnOpportunityTokens(earnOpportunity);

  const isClaimFlow = selectedClaim != null;

  const fetchCallData = useCallback(async () => {
    const client = makeClient();
    if (isClaimFlow) {
      const { data } = await client.v1.earnControllerGetClaimRedeemCalldataV1(
        earnOpportunity.slug,
        {
          address: accountAddress as Hex,
          amount: selectedClaim.assetAmount ?? '0',
        },
      );

      return data.data;
    }
    const { data } = await client.v1.earnControllerGetRequestRedeemCallDataV1(
      earnOpportunity.slug,
      { address: accountAddress as Hex, amount },
    );

    return data.data;
  }, [
    isClaimFlow,
    earnOpportunity.slug,
    accountAddress,
    selectedClaim,
    amount,
  ]);

  const transactionForm = useTransactionForm({
    chainId: earnOpportunity.lpToken.chain.chainId,
    requiresConfirmation: !isClaimFlow,
    fetchCallData,
    onSuccess: () => {
      refetchClaims();
      refetchCallback?.();
    },
  });

  const selectedClaimFromTokenBalance = useMemo(
    () =>
      createTokenBalance(
        lpToken,
        selectedClaim?.lpTokenAmount ?? selectedClaim?.assetAmount ?? '0',
      ),
    [lpToken, selectedClaim],
  );

  const selectedClaimToTokenBalance = useMemo(
    () => createTokenBalance(assetToken, selectedClaim?.assetAmount ?? '0'),
    [assetToken, selectedClaim],
  );

  const requestWithdrawToTokenBalance = useMemo(
    () => createTokenBalance(lpToken, BigInt(amount ?? 0)),
    [lpToken, amount],
  );

  const handleResetAmount = useCallback(() => {
    setAmount('0');
  }, [setAmount]);

  const handleSubmit = useCallback(
    async (props: ViewSubmitContext) => {
      if (!isClaimFlow) {
        setAmount((props.values.requestAmount as AmountValue).amount);
      }
      transactionForm.handleSubmit();
    },
    [isClaimFlow, transactionForm],
  );

  const handleModalClose = () => {
    setSelectedClaimId(null);
    handleResetAmount();
    transactionForm.resetForm();
    onClose?.();
  };

  const statusSheet = useRequestRedeemStatusSheet({
    transactionForm,
    isClaimFlow,
    selectedClaimToTokenBalance,
    requestWithdrawToTokenBalance,
    resetAmount: () => {
      handleResetAmount();
      refetchLpTokenAmount();
    },
  });

  const requestWithdrawFields = useMemo(
    () => [
      defineAmountField({
        fieldKey: 'requestAmount',
        defaultValue: { amount, maxAmount: lpTokenAmount?.toString() },
        fieldProps: {
          token: lpToken,
          label: t('form.labels.amount'),
        },
        t,
      }),
      defineDisplayTokenChainField({
        fieldKey: 'withdrawTo',
        defaultValue: assetToken,
        fieldProps: { label: t('form.labels.withdrawTo') },
        t,
      }),
    ],
    [amount, assetToken, lpToken, lpTokenAmount, t],
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
        onSubmit: handleSubmit,
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
        onSubmit: handleSubmit,
      },
    ],
    [
      requestWithdrawFields,
      handleSubmit,
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
