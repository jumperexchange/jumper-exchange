import { ExtendedChain } from '@lifi/types';
import { createContext, PropsWithChildren, useContext } from 'react';
import { useQuery } from 'react-query';

export interface ChainInfosContextProps {
  chains: ExtendedChain[];
  isSuccess: boolean;
}

const initialData = {
  chains: [],
  isSuccess: false,
};

const ChainInfosContext = createContext<ChainInfosContextProps>(initialData);

export const useChainInfos = () => {
  return useContext(ChainInfosContext);
};

export const ChainInfosProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
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
      initialData: { chains: [] },
    },
  );

  return (
    <ChainInfosContext.Provider value={{ chains: data.chains, isSuccess }}>
      {children}
    </ChainInfosContext.Provider>
  );
};
