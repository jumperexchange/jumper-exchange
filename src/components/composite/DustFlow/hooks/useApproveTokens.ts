import { useWriteContract } from 'wagmi';
import { usePublicClient, useAccount } from 'wagmi';
import { ERC20_ABI } from '../constants';
import type { Address } from 'viem';

export function useApproveTokens() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  return async (
    tokens: { address: `0x${string}`; amount: bigint }[],
    spenderAddress: Address,
  ) => {
    if (!address || !publicClient) {
      throw new Error('Wallet not connected');
    }

    const allowances = (await publicClient.multicall({
      contracts: tokens.map(({ address: token }) => ({
        address: token,
        abi: ERC20_ABI,
        functionName: 'allowance' as const,
        args: [address, spenderAddress] as const,
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
  };
}
