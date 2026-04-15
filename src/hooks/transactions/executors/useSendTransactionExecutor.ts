import { useCallback } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import type { Hex } from 'viem';
import type { TransactionAction, TransactionExecutor } from './types';

export const useSendTransactionExecutor = (): TransactionExecutor => {
  const {
    data: txHash,
    sendTransaction,
    isPending,
    isError: isWriteError,
    error: writeError,
    reset,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  const execute = useCallback(
    (action: TransactionAction, _allActions?: TransactionAction[]) => {
      sendTransaction({
        to: action.tx.to as Hex,
        data: action.tx.data as Hex,
        chainId: action.tx.chainId,
        // gasPrice: action.tx.gasPrice,
        maxFeePerGas: action.tx.maxFeePerGas,
        maxPriorityFeePerGas: action.tx.maxPriorityFeePerGas,
      });
    },
    [sendTransaction],
  );

  return {
    execute,
    reset,
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    isError: isWriteError || isTxError,
    error: writeError ?? txError ?? null,
  };
};
