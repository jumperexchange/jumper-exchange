import { useEffect, useCallback, useReducer, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { makeClient } from '@/app/lib/client';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import {
  RequestRedeemErrorType,
  RequestRedeemError,
  type RequestRedeemFormState,
} from '../types';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';
import { openInNewTab } from '@/utils/openInNewTab';
import { useTransactionFlow } from './useTransactionFlow';

// Discriminated union for transaction types
type RequestTransactionConfig = {
  type: 'request';
  initialAmount?: string;
};

type ClaimTransactionConfig = {
  type: 'claim';
  claimId: string;
  claimAmount: string;
};

type TransactionConfig = RequestTransactionConfig | ClaimTransactionConfig;

export interface UseRedeemTransactionFormOptions {
  earnOpportunity: EarnOpportunityExtended;
  onSuccess: () => void;
  config: TransactionConfig;
}

interface FormState {
  amount: string;
  currentStep: RequestRedeemFormState['currentStep'];
  showConfirmationSheet: boolean;
  showSuccessSheet: boolean;
  showErrorBottomSheet: boolean;
  errorType: RequestRedeemErrorType;
}

type FormAction =
  | { type: 'SET_AMOUNT'; payload: string }
  | { type: 'SET_STEP'; payload: RequestRedeemFormState['currentStep'] }
  | { type: 'SHOW_CONFIRMATION' }
  | { type: 'HIDE_CONFIRMATION' }
  | { type: 'SHOW_SUCCESS' }
  | { type: 'HIDE_SUCCESS' }
  | { type: 'SHOW_ERROR'; payload: RequestRedeemErrorType }
  | { type: 'HIDE_ERROR' }
  | { type: 'RESET' }
  | { type: 'CLOSE_ALL_SHEETS' };

const createInitialState = (config: TransactionConfig): FormState => ({
  amount: config.type === 'request' ? (config.initialAmount ?? '0') : '0',
  currentStep: 'idle',
  showConfirmationSheet: false,
  showSuccessSheet: false,
  showErrorBottomSheet: false,
  errorType: RequestRedeemErrorType.Unknown,
});

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload };
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
    case 'HIDE_SUCCESS':
      return { ...state, showSuccessSheet: false };
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
      return createInitialState({ type: 'request' });
    default:
      return state;
  }
}

const detectErrorType = (
  error: Error,
  step: 'fetch' | 'chain-switch' | 'transaction',
): RequestRedeemErrorType => {
  const errorMessage = error.message.toLowerCase();

  if (step === 'fetch') {
    return RequestRedeemErrorType.FetchCallDataFailed;
  }

  if (step === 'chain-switch') {
    return RequestRedeemErrorType.ChainSwitchFailed;
  }

  if (
    errorMessage.includes('user rejected') ||
    errorMessage.includes('user denied')
  ) {
    return RequestRedeemErrorType.TransactionRejected;
  }

  if (errorMessage.includes('insufficient')) {
    return RequestRedeemErrorType.InsufficientBalance;
  }

  return RequestRedeemErrorType.TransactionFailed;
};

export const useRedeemTransactionForm = ({
  earnOpportunity,
  onSuccess,
  config,
}: UseRedeemTransactionFormOptions) => {
  const accountAddress = useAccountAddress();
  const lastIntent = useRef<{ claimId?: string; amount: string } | null>(null);
  const [state, dispatch] = useReducer(formReducer, config, createInitialState);

  // Use shared transaction flow hook
  const transactionFlow = useTransactionFlow({
    onSuccess: () => {
      dispatch({ type: 'SHOW_SUCCESS' });
      onSuccess?.();
    },
    onError: (error, step) => {
      console.error('Transaction flow error:', error, step);
      const errorType = detectErrorType(error, step);
      dispatch({ type: 'SHOW_ERROR', payload: errorType });
      dispatch({ type: 'SET_STEP', payload: 'idle' });
    },
  });

  const explorerLink = useBlockchainExplorerURL(
    earnOpportunity.lpToken.chain.chainId,
    transactionFlow.txHash,
    'tx',
  );

  // Fetch call data mutation - handles both request and claim
  const fetchCallDataMutation = useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      const client = makeClient();

      if (config.type === 'request') {
        const { data } =
          await client.v1.earnControllerGetRequestRedeemCallDataV1(
            earnOpportunity.slug,
            {
              address: accountAddress as Hex,
              amount: amount,
            },
          );
        return data.data;
      } else {
        const { data } = await client.v1.earnControllerGetClaimRedeemCalldataV1(
          earnOpportunity.slug,
          {
            address: accountAddress as Hex,
            amount: amount,
          },
        );
        return data.data;
      }
    },
    onError: (error) => {
      console.error('Failed to fetch call data:', error);
      dispatch({
        type: 'SHOW_ERROR',
        payload: RequestRedeemErrorType.FetchCallDataFailed,
      });
      dispatch({ type: 'SET_STEP', payload: 'idle' });
    },
  });

  useEffect(() => {
    if (!transactionFlow.isExecuting) {
      return;
    }

    const stepMap: Record<string, RequestRedeemFormState['currentStep']> = {
      fetching: 'fetching',
      approving: 'approving',
      executing: 'requesting',
      confirming: 'requesting',
      success: 'success',
      idle: 'idle',
    };

    const nextStep = stepMap[transactionFlow.currentStep] ?? 'idle';

    if (nextStep !== state.currentStep) {
      dispatch({ type: 'SET_STEP', payload: nextStep });
    }
  }, [
    transactionFlow.currentStep,
    transactionFlow.isExecuting,
    state.currentStep,
  ]);

  const handleAmountChange = useCallback((newAmount: string) => {
    dispatch({ type: 'SET_AMOUNT', payload: newAmount });
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!accountAddress || state.currentStep !== 'idle') {
        return;
      }

      // For request type, show confirmation sheet
      if (config.type === 'request') {
        dispatch({ type: 'SHOW_CONFIRMATION' });
      } else {
        // For claim type, execute immediately
        handleExecute();
      }
    },
    [accountAddress, state.currentStep, config.type],
  );

  const handleExecute = useCallback(async () => {
    if (!accountAddress) {
      return;
    }

    const amount = config.type === 'claim' ? config.claimAmount : state.amount;

    lastIntent.current = {
      claimId: config.type === 'claim' ? config.claimId : undefined,
      amount,
    };

    dispatch({ type: 'HIDE_CONFIRMATION' });
    dispatch({ type: 'SET_STEP', payload: 'fetching' });

    try {
      const callDataResult = await fetchCallDataMutation.mutateAsync({
        amount,
      });
      if (!callDataResult) {
        throw new RequestRedeemError(
          'No data returned from call data',
          RequestRedeemErrorType.FetchCallDataFailed,
        );
      }

      await transactionFlow.executeFlow(callDataResult);
    } catch (error) {
      console.error('Failed to start redeem request:', error);
    }
  }, [
    accountAddress,
    config,
    state.amount,
    fetchCallDataMutation,
    transactionFlow,
  ]);

  const handleConfirm = useCallback(async () => {
    await handleExecute();
  }, [handleExecute]);

  const handleRetry = useCallback(async () => {
    dispatch({ type: 'HIDE_ERROR' });

    if (!accountAddress) {
      console.error('No wallet connected');
      return;
    }

    // If we have call data cached, retry the current action
    if (fetchCallDataMutation.data) {
      await transactionFlow.retryCurrentAction();
    } else if (lastIntent.current) {
      // Otherwise, restart from the beginning with last intent
      await handleExecute();
    } else {
      // Fallback to confirm flow
      await handleConfirm();
    }
  }, [
    accountAddress,
    fetchCallDataMutation.data,
    transactionFlow,
    handleExecute,
    handleConfirm,
  ]);

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
    lastIntent.current = null;
  }, [transactionFlow, fetchCallDataMutation]);

  const handleCloseSheet = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_SHEETS' });
  }, []);

  const handleCloseError = useCallback(() => {
    dispatch({ type: 'HIDE_ERROR' });
  }, []);

  const isSubmitting =
    transactionFlow.isExecuting ||
    transactionFlow.isPending ||
    transactionFlow.isConfirming;

  return {
    // State
    amount: state.amount,
    currentStep: state.currentStep,
    isSubmitting,
    isError: state.showErrorBottomSheet,
    errorType: state.errorType,
    showConfirmationSheet: state.showConfirmationSheet,
    showSuccessSheet: state.showSuccessSheet,
    showErrorBottomSheet: state.showErrorBottomSheet,
    currentActionIndex: transactionFlow.currentActionIndex,
    transactionType: config.type,

    // Actions
    handleAmountChange,
    handleConfirm,
    handleSubmit,
    handleCloseError,
    handleRetry,
    handleCloseSuccess,
    handleViewTransaction,
    handleCloseSheet,
    resetForm,
  };
};
