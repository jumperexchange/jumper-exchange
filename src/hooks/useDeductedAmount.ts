import { Chain, ChainId, ExtendedChain } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';
import { ChainType, getChains } from '@lifi/sdk';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';

interface DeducProps {
  deductedAmount: number | undefined;
}

export const useDeductedAmount = (): DeducProps => {
  let amount = undefined;
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();

  // query
  const queryIsEnabled =
    !!sourceChainToken.tokenAddress &&
    !!destinationChainToken.tokenAddress &&
    (sourceChainToken.chainId === ChainId.SOL ||
      destinationChainToken.chainId === ChainId.SOL);
  const apiBaseUrl = process.env.NEXT_PUBLIC_JUMPER_API;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['checkDeductedAmount'],
    queryFn: async () => {
      const res = await fetch(
        `${apiBaseUrl}/solana/deduct_amount?srcChainId=${sourceChainToken.chainId}&srcTokenAddress=${sourceChainToken.tokenAddress}&dstChainId=${destinationChainToken.chainId}&dstTokenAddress=${destinationChainToken.tokenAddress}'`,
      );

      if (!res.ok) {
        return undefined;
      }

      const data = await res.json();

      return data as DeducProps;
    },
    enabled: queryIsEnabled,
    refetchInterval: 1000 * 60 * 60,
  });

  if (data?.deductedAmount) {
    amount = data.deductedAmount;
  }

  return {
    deductedAmount: amount,
  };
};
