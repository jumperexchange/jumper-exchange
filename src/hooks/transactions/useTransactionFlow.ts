import { useCallback, useEffect, useRef, useState } from 'react';
import { useSwitchChain } from 'wagmi';
import { useAccount } from '@jumperexchange/wallet-management';
import type { Hex } from 'viem';
import { type TransactionAction, type ExecutorType } from './executors/types';
import { useTransactionExecutor } from './executors/useTransactionExecutor';

export interface CallDataResponse {
  actions: TransactionAction[];
}

interface UseTransactionFlowOptions {
  executorType?: ExecutorType;
  onSuccess?: () => void;
  onError?: (
    error: Error,
    step: 'fetch' | 'chain-switch' | 'transaction',
  ) => void;
}

export const useTransactionFlow = (options: UseTransactionFlowOptions = {}) => {
  const { executorType = 'single' } = options;
  const { account } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const executor = useTransactionExecutor(executorType);

  const [callData, setCallData] = useState<CallDataResponse | null>(null);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'approving' | 'executing' | 'confirming' | 'success'
  >('idle');
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [completedActionHashes, setCompletedActionHashes] = useState<
    (Hex | undefined)[]
  >([]);
  const flowLockedRef = useRef(false);

  const executeAction = useCallback(
    async (action: TransactionAction, allActions?: TransactionAction[]) => {
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

        executor.execute(action, allActions);
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        flowLockedRef.current = false;
        options.onError?.(err, 'chain-switch');
        setIsExecuting(false);
        setError(err);
        throw e;
      }
    },
    [account?.chainId, switchChainAsync, executor, options],
  );

  useEffect(() => {
    if (!executor.isError || !executor.error) {
      return;
    }

    flowLockedRef.current = false;
    options.onError?.(executor.error, 'transaction');
    setIsExecuting(false);
    setError(executor.error);
    executor.reset();
  }, [executor, options]);

  useEffect(() => {
    if (!executor.isSuccess || !callData || !isExecuting) {
      return;
    }

    const nextIndex = currentActionIndex + 1;

    if (executorType !== 'batch' && nextIndex < callData.actions.length) {
      setCompletedActionHashes((prev) => {
        const next = [...prev];
        next[currentActionIndex] = executor.txHash;
        return next;
      });
      setCurrentActionIndex(nextIndex);
      executor.reset();
      executeAction(callData.actions[nextIndex]);
    } else {
      setCompletedActionHashes((prev) => {
        if (executorType === 'batch') {
          return Array(callData.actions.length).fill(executor.txHash);
        }
        const next = [...prev];
        next[currentActionIndex] = executor.txHash;
        return next;
      });
      flowLockedRef.current = false;
      setIsExecuting(false);
      setCurrentActionIndex(0);
      setCurrentStep('success');
      setTxHash(executor.txHash);
      setCallData(null);
      executor.reset();
      options.onSuccess?.();
    }
  }, [
    executorType,
    executor,
    callData,
    isExecuting,
    currentActionIndex,
    executeAction,
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

      if (executorType === 'batch') {
        await executeAction(data.actions[0], data.actions);
      } else {
        await executeAction(data.actions[0]);
      }
    },
    [executorType, executeAction, options],
  );

  const retryCurrentAction = useCallback(async () => {
    if (!callData || flowLockedRef.current) {
      return;
    }
    flowLockedRef.current = true;
    setError(null);
    if (executorType === 'batch') {
      await executeAction(callData.actions[0], callData.actions);
    } else {
      await executeAction(callData.actions[currentActionIndex]);
    }
  }, [callData, currentActionIndex, executorType, executeAction]);

  const resetFlow = useCallback(() => {
    flowLockedRef.current = false;
    setCallData(null);
    setIsExecuting(false);
    setCurrentActionIndex(0);
    setCurrentStep('idle');
    setError(null);
    setTxHash(undefined);
    setCompletedActionHashes([]);
    executor.reset();
  }, [executor]);

  return {
    isExecuting,
    currentStep,
    currentActionIndex,
    isPending: executor.isPending,
    isConfirming: executor.isConfirming,
    error: error ?? executor.error,
    txHash: currentStep === 'success' ? txHash : executor.txHash,
    completedActionHashes,
    executeFlow,
    retryCurrentAction,
    resetFlow,
  };
};
