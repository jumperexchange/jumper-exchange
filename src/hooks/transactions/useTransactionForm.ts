import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { CallDataResponse } from '@/hooks/transactions/useTransactionFlow';
import { useTransactionFlow } from '@/hooks/transactions/useTransactionFlow';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import { openInNewTab } from '@/utils/openInNewTab';
import { TransactionErrorType, TransactionError } from './types';

export interface TransactionFormConfig {
  fetchCallData: () => Promise<CallDataResponse>;
  requiresConfirmation?: boolean;
  chainId: number;
  onSuccess?: () => void;
}

interface FormState {
  currentStep:
    | 'idle'
    | 'fetching'
    | 'approving'
    | 'requesting'
    | 'success'
    | 'confirmation';
  showConfirmationSheet: boolean;
  showSuccessSheet: boolean;
  showErrorBottomSheet: boolean;
  errorType: TransactionErrorType;
}

type FormAction =
  | { type: 'SET_STEP'; payload: FormState['currentStep'] }
  | { type: 'SHOW_CONFIRMATION' }
  | { type: 'HIDE_CONFIRMATION' }
  | { type: 'SHOW_SUCCESS' }
  | { type: 'SHOW_ERROR'; payload: TransactionErrorType }
  | { type: 'HIDE_ERROR' }
  | { type: 'CLOSE_ALL_SHEETS' }
  | { type: 'RESET' };

const initialState: FormState = {
  currentStep: 'idle',
  showConfirmationSheet: false,
  showSuccessSheet: false,
  showErrorBottomSheet: false,
  errorType: TransactionErrorType.Unknown,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SHOW_CONFIRMATION':
      return {
        ...state,
        showConfirmationSheet: true,
        currentStep: 'confirmation',
      };
    case 'HIDE_CONFIRMATION':
      return { ...state, showConfirmationSheet: false };
    case 'SHOW_SUCCESS':
      return { ...state, showSuccessSheet: true, currentStep: 'success' };
    case 'SHOW_ERROR':
      return {
        ...state,
        showErrorBottomSheet: true,
        errorType: action.payload,
      };
    case 'HIDE_ERROR':
      return { ...state, showErrorBottomSheet: false };
    case 'CLOSE_ALL_SHEETS':
      return {
        ...state,
        showConfirmationSheet: false,
        showSuccessSheet: false,
        showErrorBottomSheet: false,
        currentStep: 'idle',
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const detectErrorType = (
  error: Error,
  step: 'fetch' | 'chain-switch' | 'transaction',
): TransactionErrorType => {
  if (step === 'fetch') {
    return TransactionErrorType.FetchCallDataFailed;
  }
  if (step === 'chain-switch') {
    return TransactionErrorType.ChainSwitchFailed;
  }
  const msg = error.message.toLowerCase();
  if (msg.includes('user rejected') || msg.includes('user denied')) {
    return TransactionErrorType.TransactionRejected;
  }
  if (msg.includes('insufficient')) {
    return TransactionErrorType.InsufficientBalance;
  }
  return TransactionErrorType.TransactionFailed;
};

export const useTransactionForm = ({
  fetchCallData,
  requiresConfirmation = false,
  chainId,
  onSuccess,
}: TransactionFormConfig) => {
  const hasLastIntent = useRef(false);
  const [state, dispatch] = useReducer(formReducer, initialState);

  const transactionFlow = useTransactionFlow({
    onSuccess: () => {
      dispatch({ type: 'SHOW_SUCCESS' });
      onSuccess?.();
    },
    onError: (error, step) => {
      dispatch({ type: 'SHOW_ERROR', payload: detectErrorType(error, step) });
      dispatch({ type: 'SET_STEP', payload: 'idle' });
    },
  });

  const explorerLink = useBlockchainExplorerURL(
    chainId,
    transactionFlow.txHash,
    'tx',
  );

  const fetchCallDataMutation = useMutation({
    mutationFn: fetchCallData,
    onError: () => {
      dispatch({
        type: 'SHOW_ERROR',
        payload: TransactionErrorType.FetchCallDataFailed,
      });
      dispatch({ type: 'SET_STEP', payload: 'idle' });
    },
  });

  // Sync step labels from transactionFlow
  useEffect(() => {
    if (!transactionFlow.isExecuting) {
      return;
    }
    const stepMap: Record<string, FormState['currentStep']> = {
      fetching: 'fetching',
      approving: 'approving',
      executing: 'requesting',
      confirming: 'requesting',
      success: 'success',
      idle: 'idle',
    };
    const next = stepMap[transactionFlow.currentStep] ?? 'idle';
    if (next !== state.currentStep) {
      dispatch({ type: 'SET_STEP', payload: next });
    }
  }, [
    transactionFlow.currentStep,
    transactionFlow.isExecuting,
    state.currentStep,
  ]);

  const execute = useCallback(async () => {
    hasLastIntent.current = true;
    dispatch({ type: 'HIDE_CONFIRMATION' });
    dispatch({ type: 'SET_STEP', payload: 'fetching' });
    try {
      const callData = await fetchCallDataMutation.mutateAsync();
      if (!callData) {
        throw new TransactionError(
          'No call data returned',
          TransactionErrorType.FetchCallDataFailed,
        );
      }
      await transactionFlow.executeFlow(callData);
    } catch {
      // errors handled by mutation/transactionFlow callbacks
    }
  }, [fetchCallDataMutation, transactionFlow]);

  const handleSubmit = useCallback(async () => {
    if (state.currentStep !== 'idle') {
      return;
    }
    if (requiresConfirmation) {
      dispatch({ type: 'SHOW_CONFIRMATION' });
    } else {
      await execute();
    }
  }, [state.currentStep, requiresConfirmation, execute]);

  const handleConfirm = useCallback(() => execute(), [execute]);

  const handleRetry = useCallback(async () => {
    dispatch({ type: 'HIDE_ERROR' });
    if (fetchCallDataMutation.data) {
      await transactionFlow.retryCurrentAction();
    } else if (hasLastIntent.current) {
      await execute();
    } else {
      await handleConfirm();
    }
  }, [fetchCallDataMutation.data, transactionFlow, execute, handleConfirm]);

  const handleCloseSuccess = useCallback(() => {
    dispatch({ type: 'RESET' });
    transactionFlow.resetFlow();
  }, [transactionFlow]);

  const handleViewTransaction = useCallback(() => {
    if (explorerLink) {
      openInNewTab(explorerLink);
    }
  }, [explorerLink]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
    transactionFlow.resetFlow();
    fetchCallDataMutation.reset();
    hasLastIntent.current = false;
  }, [transactionFlow, fetchCallDataMutation]);

  return {
    currentStep: state.currentStep,
    isSubmitting:
      transactionFlow.isExecuting ||
      transactionFlow.isPending ||
      transactionFlow.isConfirming,
    errorType: state.errorType,
    showConfirmationSheet: state.showConfirmationSheet,
    showSuccessSheet: state.showSuccessSheet,
    showErrorBottomSheet: state.showErrorBottomSheet,
    currentActionIndex: transactionFlow.currentActionIndex,

    handleSubmit,
    handleConfirm,
    handleRetry,
    handleCloseError: useCallback(() => dispatch({ type: 'HIDE_ERROR' }), []),
    handleCloseSuccess,
    handleViewTransaction,
    handleCloseSheet: useCallback(
      () => dispatch({ type: 'CLOSE_ALL_SHEETS' }),
      [],
    ),
    resetForm,
  };
};
