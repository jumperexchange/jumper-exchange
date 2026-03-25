import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useSwitchChain,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import type { Hex } from 'viem';

interface TransactionAction {
  name: string;
  tx: {
    to: string;
    data: string;
    chainId: number;
  };
}

export interface CallDataResponse {
  actions: TransactionAction[];
}

interface UseTransactionFlowOptions {
  onSuccess?: () => void;
  onError?: (
    error: Error,
    step: 'fetch' | 'chain-switch' | 'transaction',
  ) => void;
}

export const useTransactionFlow = (options: UseTransactionFlowOptions = {}) => {
  const { account } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [callData, setCallData] = useState<CallDataResponse | null>(null);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'approving' | 'executing' | 'confirming' | 'success'
  >('idle');
  const [error, setError] = useState<Error | null>(null);
  const flowLockedRef = useRef(false);

  const {
    data: txHash,
    sendTransaction,
    isPending,
    isError: isWriteError,
    error: writeError,
    reset: resetWrite,
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

  const executeAction = useCallback(
    async (action: TransactionAction) => {
      try {
        if (account?.chainId !== action.tx.chainId) {
          await switchChainAsync({ chainId: action.tx.chainId });
        }

        setIsExecuting(true);

        setCurrentStep(
          action.name.toLowerCase().includes('approve')
            ? 'approving'
            : 'executing',
        );

        sendTransaction({
          to: action.tx.to as Hex,
          data: action.tx.data as Hex,
          chainId: action.tx.chainId,
        });
      } catch (e: any) {
        flowLockedRef.current = false;
        options.onError?.(e, 'chain-switch');
        setIsExecuting(false);
        setError(e);
      }
    },
    [account?.chainId, switchChainAsync, sendTransaction, options],
  );

  useEffect(() => {
    if (!isWriteError && !isTxError) {
      return;
    }

    const e = txError || writeError;
    if (!e) {
      return;
    }

    flowLockedRef.current = false;

    options.onError?.(e, 'transaction');
    setIsExecuting(false);
    setError(e);
    resetWrite();
  }, [
    isWriteError,
    isTxError,
    txError,
    writeError,
    isExecuting,
    options,
    resetWrite,
  ]);

  useEffect(() => {
    if (!isSuccess || !callData || !isExecuting) {
      return;
    }

    const nextIndex = currentActionIndex + 1;

    if (nextIndex < callData.actions.length) {
      setCurrentActionIndex(nextIndex);
      resetWrite();
      executeAction(callData.actions[nextIndex]);
    } else {
      flowLockedRef.current = false;
      setIsExecuting(false);
      setCurrentActionIndex(0);
      setCurrentStep('success');
      setCallData(null);
      options.onSuccess?.();
    }
  }, [
    isSuccess,
    callData,
    isExecuting,
    currentActionIndex,
    executeAction,
    resetWrite,
    options,
  ]);

  const executeFlow = useCallback(
    async (data: CallDataResponse) => {
      if (flowLockedRef.current) {
        return;
      }
      flowLockedRef.current = true;
      if (!data?.actions?.length) {
        flowLockedRef.current = false;
        const e = new Error('No actions');
        options.onError?.(e, 'fetch');
        throw e;
      }

      setCallData(data);
      setCurrentActionIndex(0);
      setError(null);
      await executeAction(data.actions[0]);
    },
    [executeAction, options],
  );

  const retryCurrentAction = useCallback(async () => {
    if (!callData || flowLockedRef.current) {
      return;
    }
    flowLockedRef.current = true;
    setError(null);
    await executeAction(callData.actions[currentActionIndex]);
  }, [callData, currentActionIndex, executeAction]);

  const resetFlow = useCallback(() => {
    flowLockedRef.current = false;
    setCallData(null);
    setIsExecuting(false);
    setCurrentActionIndex(0);
    setCurrentStep('idle');
    setError(null);
    resetWrite();
  }, [resetWrite]);

  return {
    isExecuting,
    currentStep,
    currentActionIndex,
    isPending,
    isConfirming,
    error,
    txHash,
    executeFlow,
    retryCurrentAction,
    resetFlow,
  };
};
