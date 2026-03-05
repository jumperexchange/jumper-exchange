import { useWriteContract, useConfig } from 'wagmi';
import { readContracts, waitForTransactionReceipt } from '@wagmi/core';
import { ERC20_ABI } from '../constants';
import type { Address } from 'viem';
import { useCallback } from 'react';

export function useApproveTokens() {
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  return useCallback(
    async (
      tokens: { address: `0x${string}`; amount: bigint }[],
      chainId: number,
      ownerAddress: Address,
      spenderAddress: Address,
    ) => {
      const allowances = await readContracts(config, {
        contracts: tokens.map(({ address: token }) => ({
          address: token,
          abi: ERC20_ABI,
          functionName: 'allowance' as const,
          args: [ownerAddress, spenderAddress] as const,
          chainId,
        })),
        allowFailure: true,
      });

      const needsApproval = tokens.filter(
        ({ amount }, i) =>
          allowances[i].status === 'success' && allowances[i].result < amount,
      );

      console.log('needsApproval', needsApproval);

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
            chainId,
          }),
        ),
      );

      console.log('hashes', hashes);

      // chainId is explicit here too
      await Promise.all(
        hashes.map((hash) =>
          waitForTransactionReceipt(config, { hash, chainId }),
        ),
      );
    },
    [config, writeContractAsync],
  );
}
