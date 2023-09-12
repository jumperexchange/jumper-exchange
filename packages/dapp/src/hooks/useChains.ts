import { useQuery } from '@tanstack/react-query';
import { useChainsStore } from '../stores/chains';

export type ChainProps = void;

export const useChains = (): ChainProps => {
  const [onChainsLoad] = useChainsStore((state) => [state.onChainsLoad]);
  const { data } = useQuery(
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
  return onChainsLoad(data?.chains ?? []);
};
