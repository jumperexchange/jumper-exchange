import { useCallback } from 'react';
import { useSendCalls } from 'wagmi';
import type { Hex } from 'viem';
import type { TransactionAction, TransactionExecutor } from './types';

/**
 * Executor that uses EIP-5792 wallet_sendCalls to batch multiple transactions
 * into a single wallet approval. Use when the wallet supports batch transactions.
 */
export const useSendCallsExecutor = (): TransactionExecutor => {
  const { sendCalls, isPending, isSuccess, isError, error, reset } =
    useSendCalls();

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

  return {
    execute,
    reset,
    txHash: undefined,
    isPending,
    isConfirming: false,
    isSuccess,
    isError,
    error: error ?? null,
  };
};
