import { useSwitchChain, useWriteContract } from 'wagmi';
import { usePublicClient } from 'wagmi';
import { ERC20_ABI } from '../constants';
import type { Address } from 'viem';
import { useCallback } from 'react';

export function useApproveTokens() {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  return useCallback(
    async (
      tokens: { address: `0x${string}`; amount: bigint }[],
      chainId: number,
      ownerAddress: Address,
      spenderAddress: Address,
    ) => {
      if (!publicClient) {
        throw new Error('Wallet not connected');
      }

      await switchChainAsync({ chainId });

      const allowances = (await publicClient.multicall({
        contracts: tokens.map(({ address: token }) => ({
          address: token,
          abi: ERC20_ABI,
          functionName: 'allowance' as const,
          args: [ownerAddress, spenderAddress] as const,
        })),
        allowFailure: false,
      })) as bigint[];

      const needsApproval = tokens.filter(
        ({ amount }, i) => allowances[i] < amount,
      );

      if (needsApproval.length === 0) {
        return;
      }

      const hashes = await Promise.all(
        needsApproval.map(({ address: token, amount }) =>
          writeContractAsync({
            address: token,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spenderAddress, amount],
          }),
        ),
      );

      await Promise.all(
        hashes.map((hash) => publicClient.waitForTransactionReceipt({ hash })),
      );
    },
    [publicClient, switchChainAsync, writeContractAsync],
  );
}
