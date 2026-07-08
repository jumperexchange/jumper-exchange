import type { SpindlFetchData, SpindlFetchParams } from '@/types/spindl';
import { callRequest } from '@/utils/callRequest';
import { getSpindlConfig } from './spindlConfig';

const FETCH_SPINDL_PATH = '/render/jumper';
const PLACEMENT_ID = 'notify_message';
const DEFAULT_LIMIT = '3';

export const fetchSpindlCards = ({
  country,
  chainId,
  tokenAddress,
  address,
}: SpindlFetchParams): Promise<SpindlFetchData> => {
  const { apiUrl, headers } = getSpindlConfig();
  return callRequest<SpindlFetchData>({
    method: 'GET',
    path: FETCH_SPINDL_PATH,
    apiUrl,
    headers,
    queryParams: {
      placement_id: PLACEMENT_ID,
      limit: DEFAULT_LIMIT,
      ...(address !== undefined && { address }),
      country,
      chain_id: chainId !== undefined ? String(chainId) : undefined,
      token_address: tokenAddress,
    },
  });
};
