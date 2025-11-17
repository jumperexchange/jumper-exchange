import { useCallback, useEffect, useRef, useState } from 'react';
import { TrackingCategory } from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import type { ProjectData } from 'src/types/questDetails';
import type { AbiFunction, Hex } from 'viem';
import { encodeFunctionData } from 'viem';
import {
  useWaitForTransactionReceipt,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { WithdrawErrorType } from './WithdrawWidget.types';
import type { Token } from '@lifi/widget';
import {
  buildWithdrawAbiArgs,
  classifyWithdrawError,
  buildTrackingData,
} from './utils';
import { WITHDRAW_FLOW_STATES } from './constants';

const defaultAbi: AbiFunction = {
  inputs: [{ name: 'amount', type: 'uint256' }],
  name: 'redeem',
  outputs: [{ name: '', type: 'uint256' }],
  stateMutability: 'nonpayable',
  type: 'function',
};

interface UseWithdrawTransactionStateProps {
  accountAddress?: string;
  projectData: ProjectData;
}

export const useWithdrawTransactionState = ({
  accountAddress,
  projectData,
}: UseWithdrawTransactionStateProps) => {
  const [value, setValue] = useState<string>('');
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [txError, setTxError] = useState<Error | null>(null);
  const [withdrawStep, setWithdrawStep] = useState<string>(
    WITHDRAW_FLOW_STATES.IDLE,
  );
  const [withdrawErrorType, setWithdrawErrorType] =
    useState<WithdrawErrorType | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    data: transactionReceiptData,
    isLoading: isTransactionReceiptLoading,
    isSuccess: isTransactionReceiptSuccess,
  } = useWaitForTransactionReceipt({
    chainId: projectData?.chainId,
    hash: txHash,
    confirmations: 5,
    pollingInterval: 1_000,
    query: {
      enabled: !!projectData?.chainId && !!txHash,
    },
  });

  const resetState = useCallback(() => {
    setIsPending(false);
    setTxError(null);
    setTxHash(undefined);
    setWithdrawErrorType(null);
    setWithdrawStep(WITHDRAW_FLOW_STATES.IDLE);
  }, []);

  return {
    value,
    setValue,
    txHash,
    setTxHash,
    txError,
    setTxError,
    withdrawStep,
    setWithdrawStep,
    withdrawErrorType,
    setWithdrawErrorType,
    isPending,
    setIsPending,
    transactionReceiptData,
    isTransactionReceiptLoading,
    isTransactionReceiptSuccess,
    resetState,
  };
};

interface UseWithdrawTransactionExecutionProps {
  withdrawAbi?: AbiFunction;
  projectData: ProjectData;
  writeDecimals: number;
  accountAddress?: string;
  enhancedToken: Token;
  state: ReturnType<typeof useWithdrawTransactionState>;
}

export const useWithdrawTransactionExecution = ({
  withdrawAbi,
  projectData,
  writeDecimals,
  accountAddress,
  enhancedToken,
  state,
}: UseWithdrawTransactionExecutionProps) => {
  const { account } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient({
    account: accountAddress as Hex,
    chainId: projectData?.chainId,
    query: {
      enabled: !!accountAddress && !!projectData?.chainId,
    },
  });

  const sendWithdrawTx = useCallback(
    async (withdrawValue: string) => {
      state.resetState();
      state.setIsPending(true);

      try {
        if (!walletClient || !accountAddress) {
          throw new Error('Wallet not connected');
        }

        if (!withdrawValue) {
          throw new Error('Amount is required');
        }

        const targetChainId = projectData?.chainId;
        const currentChainId = account?.chainId;

        if (targetChainId && targetChainId !== currentChainId) {
          state.setWithdrawStep(WITHDRAW_FLOW_STATES.SWITCHING_CHAIN);
          try {
            await switchChainAsync({ chainId: targetChainId });
          } catch (switchError) {
            const error = new Error('Failed to switch chain for withdrawal');
            state.setTxError(error);
            state.setWithdrawErrorType(WithdrawErrorType.ChainSwitchFailed);
            state.setWithdrawStep(WITHDRAW_FLOW_STATES.ERROR);
            state.setIsPending(false);
            return;
          }
        }

        state.setWithdrawStep(WITHDRAW_FLOW_STATES.WAITING_FOR_TRANSACTION);

        const abi = withdrawAbi || defaultAbi;
        const dynamicArgs = buildWithdrawAbiArgs(
          abi.inputs,
          withdrawValue,
          writeDecimals,
          accountAddress as Hex,
        );

        const data = encodeFunctionData({
          abi: [abi],
          functionName: (abi.name || 'redeem') as 'redeem',
          args: dynamicArgs as unknown as readonly [bigint],
        });

        const hash = await walletClient.sendTransaction({
          account: accountAddress as Hex,
          to: (projectData?.withdrawAddress || projectData?.address) as Hex,
          chainId: targetChainId,
          data,
        });

        state.setTxHash(hash);
        state.setWithdrawStep(WITHDRAW_FLOW_STATES.SUCCESS);
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error('Withdrawal failed');

        const errorType = classifyWithdrawError(err);

        state.setTxError(err);
        state.setWithdrawErrorType(errorType);
        state.setWithdrawStep(WITHDRAW_FLOW_STATES.ERROR);
      } finally {
        state.setIsPending(false);
      }
    },
    [
      walletClient,
      accountAddress,
      projectData,
      account?.chainId,
      switchChainAsync,
      withdrawAbi,
      writeDecimals,
      state,
    ],
  );

  return { sendWithdrawTx };
};

interface UseWithdrawTrackingProps {
  projectData: ProjectData;
  enhancedToken: Token;
  withdrawValue: string;
  isTransactionReceiptSuccess: boolean;
  withdrawStep: string;
  refetchPosition: () => void;
}

export const useWithdrawTracking = ({
  projectData,
  enhancedToken,
  withdrawValue,
  isTransactionReceiptSuccess,
  withdrawStep,
  refetchPosition,
}: UseWithdrawTrackingProps) => {
  const { trackEvent } = useUserTracking();

  useEffect(() => {
    if (
      !isTransactionReceiptSuccess ||
      withdrawStep !== WITHDRAW_FLOW_STATES.SUCCESS
    ) {
      return;
    }

    refetchPosition();
    const trackingData = buildTrackingData(
      projectData.integrator,
      enhancedToken,
      withdrawValue,
    );

    trackEvent({
      category: TrackingCategory.WidgetEvent,
      action: 'zap_withdraw',
      label: 'execution_success',
      data: trackingData,
      isConversion: true,
    });
  }, [
    trackEvent,
    projectData,
    isTransactionReceiptSuccess,
    withdrawStep,
    refetchPosition,
    enhancedToken,
    withdrawValue,
  ]);
};
