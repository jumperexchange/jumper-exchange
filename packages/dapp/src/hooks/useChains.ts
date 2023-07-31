import { ExtendedChain } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';

export interface ChainProps {
  chains: ExtendedChain[];
  isSuccess: boolean;
}

export const useChains = (): ChainProps => {
  const { data, isSuccess } = useQuery(
    ['chainStats'],
    async () => {
      const apiUrl = import.meta.env.VITE_LIFI_API_URL;
      const response = await fetch(`${apiUrl}/chains`);
      const result = await response.json();
      return result;
    },
    {
      enabled: true,
      refetchInterval: 1000 * 60 * 60,
    },
  );
  return {
    chains: data?.chains ?? [],
    isSuccess,
  };
};
