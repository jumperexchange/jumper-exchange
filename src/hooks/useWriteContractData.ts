import { useState, useEffect } from 'react';
import type { Address } from 'viem';
import { createWalletClient, http, custom } from 'viem';
import { mainnet, base } from 'viem/chains';

interface UseContractWriteProps {
  address: Address;
  abi: any[];
  functionName: string;
  args?: any[];
  enabled?: boolean;
  chainId?: number;
}

export function useContractWrite({
  address,
  abi,
  functionName,
  enabled = true,
  chainId = 1,
}: UseContractWriteProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const writeContract = async (args: any[]) => {
    if (!enabled || !window.ethereum) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const client = createWalletClient({
        chain: chainId === 1 ? mainnet : base,
        transport: custom(window.ethereum),
      });

      const [account] = await client.requestAddresses();

      const hash = await client.writeContract({
        account,
        address,
        abi,
        functionName,
        args,
      });

      setData(hash);
      return hash;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    write: writeContract,
    data,
    isLoading,
    error,
  };
}
