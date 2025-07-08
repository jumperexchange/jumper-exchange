import { TokenAmount } from '@lifi/sdk';
import { useCallback, useEffect, useRef } from 'react';
import { TrackingCategory } from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { ProjectData } from 'src/types/questDetails';
import { AbiFunction, AbiParameter, parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { SuccessDataRef } from './WithdrawWidget.types';

const defaultAbi: AbiFunction = {
  inputs: [{ name: 'amount', type: 'uint256' }],
  name: 'redeem',
  outputs: [{ name: '', type: 'uint256' }],
  stateMutability: 'nonpayable',
  type: 'function',
};

interface UseWithdrawSubmitProps {
  withdrawAbi?: AbiFunction;
  projectData: ProjectData;
  writeDecimals: number;
  accountAddress?: string;
}

export const useWithdrawTransaction = ({
  withdrawAbi,
  accountAddress,
  projectData,
  writeDecimals,
}: UseWithdrawSubmitProps) => {
  const successDataRef = useRef<SuccessDataRef>({} as SuccessDataRef);

  const { writeContract, data, isPending, isError, error, isSuccess } =
    useWriteContract();

  const {
    data: transactionReceiptData,
    isLoading: isTransactionReceiptLoading,
    isSuccess: isTransactionReceiptSuccess,
  } = useWaitForTransactionReceipt({
    chainId: projectData?.chainId,
    hash: data,
    confirmations: 5,
    pollingInterval: 1_000,
    query: {
      enabled: !!projectData?.chainId && !!data,
    },
  });

  const sendWithdrawTx = useCallback((value: string) => {
    // Generate dynamic args based on ABI inputs
    const abi = withdrawAbi || defaultAbi;

    const dynamicArgs = abi.inputs?.map((input: AbiParameter) => {
      if (input.type === 'uint256') {
        return parseUnits(value, writeDecimals);
      } else if (input.type === 'address') {
        // Use the user's account address
        return accountAddress as `0x${string}`;
      }
    }) || [parseUnits(value, writeDecimals)];

    writeContract({
      address: (projectData?.withdrawAddress ||
        projectData?.address) as `0x${string}`,
      chainId: projectData?.chainId,
      functionName: (withdrawAbi?.name || 'redeem') as 'redeem',
      abi: withdrawAbi
        ? [withdrawAbi]
        : [
            {
              inputs: [{ name: 'amount', type: 'uint256' }],
              name: 'redeem',
              outputs: [{ name: '', type: 'uint256' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
      args: dynamicArgs as unknown as readonly [bigint],
    });
  }, []);

  const { trackEvent } = useUserTracking();

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    successDataRef.current?.callback?.();
    const trackingData = {
      protocol_name: projectData.integrator,
      chain_id: successDataRef.current?.token?.chainId ?? '',
      withdrawn_token: successDataRef.current?.token?.address ?? '',
      amount_withdrawn: successDataRef.current?.value ?? 'NA',
      amount_withdrawn_usd:
        parseFloat(successDataRef.current?.value ?? '0') *
        parseFloat(successDataRef.current?.tokenPriceUSD ?? '0'),
      timestamp: new Date().toISOString(),
    };

    trackEvent({
      category: TrackingCategory.WidgetEvent,
      action: 'zap_withdraw',
      label: 'execution_success',
      data: trackingData,
      isConversion: true,
    });
  }, [transactionReceiptData]);

  return {
    txHash: data,
    txError: error,
    isWriteContractDataPending: isPending,
    isWriteContractDataError: isError,
    isWriteContractDataSuccess: isSuccess,
    transactionReceiptData,
    isTransactionReceiptLoading,
    isTransactionReceiptSuccess,
    successDataRef,
    sendWithdrawTx,
  };
};
