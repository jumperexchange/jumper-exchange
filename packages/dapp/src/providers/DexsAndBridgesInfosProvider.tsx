import { ToolsResponse } from '@lifi/sdk';
import axios, { AxiosResponse } from 'axios';
import { createContext, PropsWithChildren, useContext } from 'react';
import { useQuery } from 'react-query';

export interface DexsAndBridgesInfosContextProps {
  data: ToolsResponse;
  isSuccess: boolean;
}

const initialData = {
  data: {
    exchanges: [],
    bridges: [],
  },
  isSuccess: false,
};

const DexsAndBridgesInfosContext =
  createContext<DexsAndBridgesInfosContextProps>(initialData);

export const useDexsAndBridgesInfos = () => {
  return useContext(DexsAndBridgesInfosContext);
};

export const DexsAndBridgesInfosProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { data, isSuccess } = useQuery(
    ['toolsStats'],
    async () => {
      const apiUrl = import.meta.env.VITE_LIFI_API_URL;
      const result = await axios<ToolsResponse>({
        method: 'GET',
        url: `${apiUrl}/tools`,
      });
      return result;
    },
    {
      enabled: true,
      refetchInterval: 1000 * 60 * 60,
      initialData: {
        data: {
          exchanges: [],
          bridges: [],
        },
      } as AxiosResponse<ToolsResponse, any>,
    },
  );

  return (
    <DexsAndBridgesInfosContext.Provider value={{ data: data.data, isSuccess }}>
      {children}
    </DexsAndBridgesInfosContext.Provider>
  );
};
