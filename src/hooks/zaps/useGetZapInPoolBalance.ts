import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getToken, getTokenBalances } from '@lifi/sdk';
import { type Hex, type Address, isAddress } from 'viem';
import { sdkClient } from '@/utils/instrumentation/lifiSdkConfig';

const BALANCE_OF_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const DECIMALS_ABI = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const tokenBalanceQueryKeys = {
  all: ['tokenBalance'] as const,
  lifi: (chainId: number, tokenAddress: string, walletAddress: string) =>
    [
      ...tokenBalanceQueryKeys.all,
      'lifi',
      chainId,
      tokenAddress,
      walletAddress,
    ] as const,
} as const;

interface TokenBalanceResult {
  depositTokenData: bigint | number | undefined;
  depositTokenDecimals: bigint | number | undefined;
  isLoadingDepositTokenData: boolean;
  refetchDepositToken: () => void;
}

export const useGetZapInPoolBalance = (
  walletAddress: string | undefined,
  tokenAddress: Hex,
  chainId: number,
): TokenBalanceResult => {
  const isEvmWallet = !!walletAddress && isAddress(walletAddress);
  const isNonEvmWallet = !!walletAddress && !isEvmWallet;

  const contractsConfig = useMemo(
    () => [
      {
        abi: BALANCE_OF_ABI,
        address: tokenAddress,
        chainId,
        functionName: 'balanceOf' as const,
        args: [walletAddress as Address],
      },
      {
        abi: DECIMALS_ABI,
        address: tokenAddress,
        chainId,
        functionName: 'decimals' as const,
      },
    ],
    [walletAddress, tokenAddress, chainId],
  );

  const {
    data: evmData,
    isLoading: isEvmLoading,
    refetch: refetchEvm,
  } = useReadContracts({
    contracts: contractsConfig,
    query: { enabled: isEvmWallet },
  });

  const {
    data: lifiData,
    isLoading: isLifiLoading,
    refetch: refetchLifi,
  } = useQuery({
    queryKey: tokenBalanceQueryKeys.lifi(
      chainId,
      tokenAddress,
      walletAddress ?? '',
    ),
    queryFn: async () => {
      const token = await getToken(sdkClient, chainId, tokenAddress);
      const [balance] = await getTokenBalances(sdkClient, walletAddress!, [
        token,
      ]);
      return balance ?? null;
    },
    enabled: isNonEvmWallet,
    staleTime: 30_000,
    gcTime: 60_000,
  });

  return useMemo<TokenBalanceResult>(() => {
    if (isEvmWallet) {
      const [
        { result: depositTokenData } = {},
        { result: depositTokenDecimals } = {},
      ] = evmData ?? [];

      return {
        depositTokenData,
        depositTokenDecimals,
        isLoadingDepositTokenData: isEvmLoading,
        refetchDepositToken: refetchEvm,
      };
    }

    return {
      depositTokenData:
        lifiData?.amount !== undefined ? BigInt(lifiData.amount) : undefined,
      depositTokenDecimals: lifiData?.decimals,
      isLoadingDepositTokenData: isLifiLoading,
      refetchDepositToken: refetchLifi,
    };
  }, [
    isEvmWallet,
    evmData,
    isEvmLoading,
    refetchEvm,
    lifiData,
    isLifiLoading,
    refetchLifi,
  ]);
};
