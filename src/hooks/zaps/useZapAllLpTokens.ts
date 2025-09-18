import { BaseToken } from '@lifi/widget';
import { useQuery } from '@tanstack/react-query';
import config from 'src/config/env-config';

type ZapLpTokensResult = Pick<BaseToken, 'address' | 'chainId'>[] | undefined;

export const useZapAllLpTokens = () => {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;

  return useQuery<ZapLpTokensResult>({
    queryKey: ['zaps', 'all-lp-tokens'],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/zaps/get-all-lp-tokens`);

      if (!res.ok) {
        return;
      }

      const resFormatted = await res.json();

      if (!resFormatted || !('data' in resFormatted)) {
        return;
      }

      const { data } = resFormatted;

      return data;
    },
    enabled: true,
    refetchInterval: 1 * 60 * 1000,
  });
};
