import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { ONE_DAY_MS } from 'src/const/time';
import { GetInfoPayload } from '@biconomy/abstractjs';

const BICONOMY_NETWORK_URL = 'https://network.biconomy.io';

export const useZapSupportedChains = () => {
  return useQuery<GetInfoPayload['supportedChains']>({
    queryKey: ['zap-supported-chains'],
    queryFn: async () => {
      const response = await fetch(`${BICONOMY_NETWORK_URL}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.NEXT_PUBLIC_BICONOMY_API_KEY,
        },
      });

      if (!response.ok) {
        return undefined;
      }

      const parsedResponse = await response.json();

      if (!parsedResponse.supportedChains) {
        return undefined;
      }

      return parsedResponse.supportedChains;
    },
    refetchInterval: ONE_DAY_MS,
  });
};
