import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSendCalls, useWaitForCallsStatus } from 'wagmi';
import { type GetCallsStatusReturnType } from 'viem/actions';
import { type Hex } from 'viem';
import type { TransactionAction, TransactionExecutor } from './types';

type CallBatchReceipt = NonNullable<
  GetCallsStatusReturnType['receipts']
>[number];

/**
 * Executor that uses EIP-5792 wallet_sendCalls to batch multiple transactions
 * into a single wallet approval. Use when the wallet supports batch transactions.
 */
export const useSendCallsExecutor = (): TransactionExecutor => {
  const [txHash, setTxHash] = useState<Hex | undefined>();
  const [error, setError] = useState<Error | undefined>();

  const {
    sendCalls,
    data: sendCallsData,
    isPending,
    isError: isSendCallsError,
    error: sendCallsError,
    reset,
  } = useSendCalls();

  // @Note: this is the batch hash
  const sendCallsDataId = sendCallsData?.id ?? '';

  const {
    data: callsStatusData,
    isSuccess,
    isLoading: isConfirming,
  } = useWaitForCallsStatus({
    id: sendCallsDataId,
    query: {
      enabled: !!sendCallsDataId,
    },
  });

  const execute = useCallback(
    (action: TransactionAction, allActions?: TransactionAction[]) => {
      const actions = allActions?.length ? allActions : [action];

      const calls = actions.map((a) => ({
        chainId: a.tx.chainId,
        to: a.tx.to as Hex,
        data: a.tx.data as Hex,
        value: BigInt(a.tx.value ?? 0),
      }));

      sendCalls({
        calls,
      });
    },
    [sendCalls],
  );

  // @Note: this is based on sdk waitForBatchTransactionReceipt
  useEffect(() => {
    if (!callsStatusData) {
      return;
    }

    if (callsStatusData?.status === 'success') {
      if (
        !callsStatusData.receipts?.length ||
        !callsStatusData.receipts.every(
          (receipt: CallBatchReceipt) => receipt.transactionHash,
        ) ||
        callsStatusData.receipts.some(
          (receipt: CallBatchReceipt) => receipt.status === 'reverted',
        )
      ) {
        setError(new Error('Transaction was reverted.'));
        return;
      }

      const transactionReceipt = callsStatusData.receipts.at(-1)!;
      setTxHash(transactionReceipt.transactionHash);
    }
    if (
      callsStatusData?.statusCode >= 400 &&
      callsStatusData?.statusCode < 500
    ) {
      setError(new Error('Transaction was canceled.'));
    }

    setError(new Error('Transaction failed.'));
  }, [callsStatusData]);

  const handleReset = useCallback(() => {
    reset();
    setTxHash(undefined);
    setError(undefined);
  }, [reset]);

  return {
    execute,
    reset: handleReset,
    txHash,
    isPending,
    isConfirming,
    isSuccess: isSuccess && !!txHash,
    isError: isSendCallsError || !!error,
    error: sendCallsError ?? error ?? null,
  };
};
