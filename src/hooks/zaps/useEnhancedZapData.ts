import { useCallback, useMemo } from 'react';
import { ProjectData } from 'src/types/questDetails';
import { useReadContracts } from 'wagmi';
import { useZaps } from '../useZaps';
import { useAccount } from '@lifi/wallet-management';
import { EVMAddress } from 'src/types/internal';
import { retryWithBackoff } from 'src/utils/retryWithBackoff';

export const useEnhancedZapData = (projectData: ProjectData) => {
  const { data, isSuccess } = useZaps(projectData);
  const zapData = data?.data;

  const { account } = useAccount();

  const contractsConfig = useMemo(() => {
    return [
      {
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: projectData.address as EVMAddress,
        chainId: projectData.chainId,
        functionName: 'balanceOf',
        args: [account.address as EVMAddress],
      },
      {
        abi: [
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: (projectData.tokenAddress ||
          projectData.address) as EVMAddress,
        chainId: projectData.chainId,
        functionName: 'decimals',
      },
    ];
  }, [
    projectData.address,
    projectData.tokenAddress,
    projectData.chainId,
    account.address,
  ]);

  const {
    data: [
      { result: depositTokenData } = {},
      { result: depositTokenDecimals } = {},
    ] = [],
    isLoading: isLoadingDepositTokenData,
    refetch: refetchDepositToken,
  } = useReadContracts({
    contracts: contractsConfig,
    query: {
      enabled: !!account.address,
      refetchOnMount: 'always',
    },
  });

  const refetchWithBalanceRetry = useCallback(async () => {
    return retryWithBackoff(
      async () => {
        const result = await refetchDepositToken();
        const balance = result.data?.[0]?.result;

        // If there is no balance, we trigger a retry
        if (!balance) {
          throw new Error('Balance is 0, retrying...');
        }

        return result;
      },
      5,
      2000,
    );
  }, [refetchDepositToken]);

  return {
    zapData,
    isSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken: refetchWithBalanceRetry,
  };
};
