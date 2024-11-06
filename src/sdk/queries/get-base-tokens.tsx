import { type TypedRoycoClient } from '../client';
import type { Tables } from '../types';

export type BaseTokens = Array<
  Pick<Tables<'base_tokens'>, 'ids' | 'image' | 'symbol'>
>;

export const getBaseTokensQueryOptions = (client: TypedRoycoClient) => ({
  queryKey: ['base_tokens'],
  queryFn: async () => {
    return client
      .from('base_tokens')
      .select('ids, image, symbol')
      .throwOnError()
      .then((result) => result.data);
  },
  keepPreviousData: true,
  refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
