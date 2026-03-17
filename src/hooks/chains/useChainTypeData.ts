import { useChainDetails } from './useChainDetails';
import { useAccountForChainType } from '../accounts/useAccountForChainType';
import { useChainsForChainType } from './useChainsForChainType';

export const useChainTypeData = (chainId?: number) => {
  const { chain, isLoading } = useChainDetails(chainId);
  const account = useAccountForChainType(chain?.chainType);
  const chains = useChainsForChainType(chain?.chainType);

  return {
    account,
    isAccountConnected: !!account,
    chains,
    chainIds: chains.map((c) => c.id),
    chain,
    isLoading,
  };
};
