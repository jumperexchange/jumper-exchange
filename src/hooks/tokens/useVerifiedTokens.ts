import type { BaseToken } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { getQueryKey } from '@/utils/queries/getQueryKey';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

interface VerifiedTokensResponse {
  tokens?: BaseToken[];
}

/**
 * Tokens curated as verified in the jumper-allowlist, served by
 * jumper-backend. Fed into the widget's `tokens.verified` config to suppress
 * the unverified-token warning.
 */
export const useVerifiedTokens = (): BaseToken[] | undefined => {
  const { data } = useQuery({
    queryKey: [getQueryKey('verified-tokens')],
    queryFn: async (): Promise<BaseToken[]> => {
      const res = await fetch(
        `${config.NEXT_PUBLIC_BACKEND_URL}/tokens/verified`,
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch verified tokens: ${res.status}`);
      }
      const { tokens }: VerifiedTokensResponse = await res.json();
      return tokens ?? [];
    },
    staleTime: SIX_HOURS_MS,
    gcTime: SIX_HOURS_MS,
    refetchOnWindowFocus: false,
  });

  return data;
};
