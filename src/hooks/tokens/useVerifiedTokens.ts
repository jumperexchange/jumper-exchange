import { makeClient } from '@/app/lib/client';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import type { BaseToken } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

/**
 * Tokens curated as verified in the jumper-allowlist, served by
 * jumper-backend. Fed into the widget's `tokens.verified` config to suppress
 * the unverified-token warning.
 */
export const useVerifiedTokens = (): BaseToken[] | undefined => {
  const { data } = useQuery({
    queryKey: [getQueryKey('verified-tokens')],
    queryFn: async (): Promise<BaseToken[]> => {
      const client = makeClient();
      const res = await client.v1.verifiedTokensControllerGetVerifiedTokensV1();
      return (res.data.tokens ?? []) as BaseToken[];
    },
    staleTime: SIX_HOURS_MS,
    gcTime: SIX_HOURS_MS,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return data;
};
