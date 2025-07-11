import { useMemo } from 'react';
import { ProjectData } from 'src/types/questDetails';
import { useReadContracts } from 'wagmi';
import { useZaps } from '../useZaps';
import { useAccount } from '@lifi/wallet-management';

export const useEnhancedZapData = (projectData: ProjectData) => {
  const { data, isSuccess } = useZaps(projectData);
  const zapData = data?.data;

  const { account } = useAccount();

  const contractsConfig = useMemo(() => {
    return [
      {
        address: projectData.address as `0x${string}`,
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        functionName: 'balanceOf',
        args: [account.address as `0x${string}`],
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
          projectData.address) as `0x${string}`,
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
    },
  });

  return {
    zapData,
    isSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  };
};
