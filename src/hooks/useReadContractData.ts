import { useState, useEffect } from 'react';
import type { Address } from 'viem';
import { createPublicClient, http, PublicClient } from 'viem';
import { mainnet } from 'viem/chains'; // Import the chain you need

interface UseContractReadProps {
  address: Address;
  abi: any[];
  functionName: string;
  args?: any[];
  enabled?: boolean;
  chainId?: number;
}

export function useContractRead({
  address,
  abi,
  functionName,
  args = [],
  enabled = true,
  chainId = 1, // default to mainnet
}: UseContractReadProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!enabled) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const client = createPublicClient({
          chain: mainnet,
          transport: http(),
        });

        const result = await client.readContract({
          address,
          abi,
          functionName,
          args,
        });

        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [address, functionName, JSON.stringify(args), enabled, chainId]);

  return { data, isLoading, error };
}
