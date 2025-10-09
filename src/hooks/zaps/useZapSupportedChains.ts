import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { ONE_DAY_MS } from 'src/const/time';
import { GetInfoPayload } from '@biconomy/abstractjs';

export const useZapSupportedChains = () => {
  return useQuery<GetInfoPayload['supportedChains']>({
    queryKey: ['zap-supported-chains'],
    queryFn: async () => {
      const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
      
      const response = await fetch(`${apiBaseUrl}/zaps/supported-chains`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return undefined;
      }

      const parsedResponse = await response.json();

      if (!parsedResponse) {
        return undefined;
      }

      const { data: supportedChains } = parsedResponse;

      return supportedChains;
    },
    refetchInterval: ONE_DAY_MS,
  });
};
