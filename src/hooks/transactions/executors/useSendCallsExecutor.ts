import { useCallback, useMemo } from 'react';
import { useCallsStatus, useSendCalls } from 'wagmi';
import { type Hex } from 'viem';
import type { TransactionAction, TransactionExecutor } from './types';

/**
 * Executor that uses EIP-5792 wallet_sendCalls to batch multiple transactions
 * into a single wallet approval. Use when the wallet supports batch transactions.
 */
export const useSendCallsExecutor = (): TransactionExecutor => {
  const {
    sendCalls,
    data: sendCallsData,
    isPending,
    isError: isSendCallsError,
    error: sendCallsError,
    reset,
  } = useSendCalls();

  const sendCallsDataId = sendCallsData?.id ?? '';

  const {
    data: callsStatusData,
    isSuccess,
    isLoading: isConfirming,
    isError: isCallsStatusError,
    error: callsStatusError,
    refetch,
  } = useCallsStatus({
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

  const txHash = useMemo(() => {
    if (!callsStatusData?.receipts?.length) {
      return undefined;
    }
    // @TODO maybe here we need some checks for the receipt status
    const transactionReceipt = callsStatusData.receipts.at(-1)!;
    return transactionReceipt.transactionHash;
  }, [callsStatusData]);

  return {
    execute,
    reset,
    txHash,
    isPending,
    isConfirming,
    isSuccess: isSuccess && !!txHash,
    isError: isSendCallsError || isCallsStatusError,
    error: sendCallsError ?? callsStatusError ?? null,
  };
};
