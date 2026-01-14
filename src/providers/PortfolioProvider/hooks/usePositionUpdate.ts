import { useCallback, useState } from 'react';
import { useConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import type { Hex } from 'viem';
import {
  usePortfolioCacheStore,
  type PositionKey,
} from '@/stores/portfolio/PortfolioCacheStore';

const erc20BalanceOfAbi = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export interface UpdatePositionParams {
  walletAddress: Hex;
  chainId: number;
  lpTokenAddress: Hex;
}

export interface UsePositionUpdateResult {
  /** Update a position's LP token amount by reading from the contract */
  updatePositionFromContract: (params: UpdatePositionParams) => Promise<void>;
  /** Whether an update is currently in progress */
  isUpdating: boolean;
  /** Error from the last update attempt */
  error: Error | null;
}

/**
 * Hook for updating a specific position's LP token amount by reading from the smart contract.
 * This allows immediate updates after deposit/withdraw without waiting for backend indexer.
 */
export const usePositionUpdate = (): UsePositionUpdateResult => {
  const wagmiConfig = useConfig();
  const patchPositionAmount = usePortfolioCacheStore(
    (s) => s.patchPositionAmount,
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePositionFromContract = useCallback(
    async ({
      walletAddress,
      chainId,
      lpTokenAddress,
    }: UpdatePositionParams) => {
      setIsUpdating(true);
      setError(null);

      try {
        const balance = await readContract(wagmiConfig, {
          address: lpTokenAddress,
          abi: erc20BalanceOfAbi,
          functionName: 'balanceOf',
          args: [walletAddress],
          chainId,
        });

        const positionKey: PositionKey = {
          chainId,
          lpTokenAddress,
        };

        patchPositionAmount(walletAddress, positionKey, balance.toString());
      } catch (err) {
        const updateError =
          err instanceof Error ? err : new Error('Failed to update position');
        setError(updateError);
        console.error('Failed to update position from contract:', updateError);
      } finally {
        setIsUpdating(false);
      }
    },
    [wagmiConfig, patchPositionAmount],
  );

  return {
    updatePositionFromContract,
    isUpdating,
    error,
  };
};
