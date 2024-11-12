import { type TypedRoycoClient } from '../client';
import { getSupportedChain } from '../utils';
import type { CustomTokenData } from '../types';

export const getEnrichedRoycoStatsQueryOptions = (
  client: TypedRoycoClient,
  custom_token_data?: CustomTokenData,
  testnet: boolean = false,
) => ({
  queryKey: ['get-enriched-royco-stats', `testnet=${testnet}`],
  queryFn: async () => {
    const result = await client.rpc('get_enriched_royco_stats', {
      custom_token_data,
    });

    let total_volume = 0;
    let total_tvl = 0;
    let total_incentives = 0;

    if (
      result &&
      'data' in result &&
      Array.isArray(result.data) &&
      result.data.length > 0
    ) {
      for (const item of result.data) {
        if (item.chain_id !== null) {
          const chain = getSupportedChain(item.chain_id);

          if (testnet === true) {
            total_volume += item.total_volume ?? 0;
            total_tvl += item.total_tvl ?? 0;
            total_incentives += item.total_incentives ?? 0;
          } else {
            if (chain?.testnet !== true) {
              total_volume += item.total_volume ?? 0;
              total_tvl += item.total_tvl ?? 0;
              total_incentives += item.total_incentives ?? 0;
            }
          }
        }
      }
    }

    return {
      total_volume,
      total_tvl,
      total_incentives,
    };
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  staleTime: 1000 * 60 * 1, // 1 min
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
