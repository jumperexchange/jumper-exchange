import type { AbiParameter, Hex } from 'viem';
import { parseUnits } from 'viem';
import type { WithdrawStatusSheetContent } from './WithdrawWidget.types';
import { WithdrawErrorType } from './WithdrawWidget.types';
import type { Token } from '@lifi/widget';
import type { TFunction } from 'i18next';

export const getErrorStatusContent = (
  errorType: WithdrawErrorType,
  t: TFunction,
  handleNavigateToGas: () => void,
): WithdrawStatusSheetContent => {
  switch (errorType) {
    case WithdrawErrorType.ChainSwitchFailed:
      return {
        title: t('widget.withdraw.error.chainSwitchFailed.title'),
        description: t('widget.withdraw.error.chainSwitchFailed.description'),
        callToAction: t('widget.withdraw.error.chainSwitchFailed.tryAgain'),
        callToActionType: 'submit' as const,
      };
    case WithdrawErrorType.SignatureFailed:
      return {
        title: t('widget.withdraw.error.signatureFailed.title'),
        description: t('widget.withdraw.error.signatureFailed.description'),
        callToAction: t('widget.withdraw.error.signatureFailed.tryAgain'),
        callToActionType: 'submit' as const,
      };
    case WithdrawErrorType.InsufficientGas:
      return {
        title: t('widget.withdraw.error.insufficientGas.title'),
        description: t('widget.withdraw.error.insufficientGas.description'),
        callToAction: t('widget.withdraw.error.insufficientGas.increaseGas'),
        callToActionType: 'button' as const,
        onClick: handleNavigateToGas,
      };
    default:
      return {
        title: t('widget.withdraw.error.transactionFailed.title'),
        description: t('widget.withdraw.error.transactionFailed.description'),
        callToAction: t('widget.withdraw.error.transactionFailed.tryAgain'),
        callToActionType: 'submit' as const,
      };
  }
};

export const getButtonLabel = (step: string, t: TFunction): string => {
  switch (step) {
    case 'switching_chain':
      return t('widget.withdraw.switchChain');
    case 'waiting_for_transaction':
      return t('widget.withdraw.waitingForTransaction');
    default:
      return t('widget.withdraw.withdraw');
  }
};

export const classifyWithdrawError = (error: Error): WithdrawErrorType => {
  const errorMessage = error.message.toLowerCase();

  if (
    ['signature', 'sign', 'rejected', 'denied'].some((keyword) =>
      errorMessage.includes(keyword),
    )
  ) {
    return WithdrawErrorType.SignatureFailed;
  }

  if (
    ['gas', 'insufficient'].some((keyword) => errorMessage.includes(keyword))
  ) {
    return WithdrawErrorType.InsufficientGas;
  }

  return WithdrawErrorType.TransactionFailed;
};

export const buildWithdrawAbiArgs = (
  abiInputs: readonly AbiParameter[] | undefined,
  value: string,
  writeDecimals: number,
  accountAddress: Hex,
): unknown[] => {
  if (!abiInputs || abiInputs.length === 0) {
    return [parseUnits(value, writeDecimals)];
  }

  return Array.from(abiInputs).map((input: AbiParameter) => {
    if (input.type === 'uint256') {
      return parseUnits(value, writeDecimals);
    } else if (input.type === 'address') {
      return accountAddress;
    }
    return null;
  });
};

export const buildTrackingData = (
  integrator: string,
  token: Token,
  amount: string,
) => ({
  protocol_name: integrator,
  chain_id: token.chainId ?? '',
  withdrawn_token: token.address ?? '',
  amount_withdrawn: amount ?? 'NA',
  amount_withdrawn_usd:
    parseFloat(amount ?? '0') * parseFloat(token.priceUSD ?? '0'),
  timestamp: new Date().toISOString(),
});
