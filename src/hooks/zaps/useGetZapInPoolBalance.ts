import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { Hex } from 'viem';

export const useGetZapInPoolBalance = (
  walletAddress: Hex,
  tokenAddress: Hex,
  chainId: number,
) => {
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
        address: tokenAddress,
        chainId,
        functionName: 'balanceOf',
        args: [walletAddress],
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
        address: tokenAddress,
        chainId: chainId,
        functionName: 'decimals',
      },
    ];
  }, [walletAddress, tokenAddress, chainId]);

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
      enabled: !!walletAddress,
    },
  });

  return {
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  };
};
