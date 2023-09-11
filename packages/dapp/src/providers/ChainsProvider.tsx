import { useEffect } from 'react';
import { useChains } from '../hooks/useChains';
import { useChainsStore } from '../stores/chains';

export const ChainsProvider = () => {
  const [onChainsLoad] = useChainsStore((state) => [state.onChainsLoad]);
  const { chains, isSuccess } = useChains();

  useEffect(() => {
    if (isSuccess) {
      onChainsLoad(chains);
    }
  }, [chains, isSuccess, onChainsLoad]);

  return <></>;
};
