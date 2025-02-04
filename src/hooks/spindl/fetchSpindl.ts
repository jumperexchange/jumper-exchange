import type {
  SpindlData,
  SpindlFetchParams,
  SpindlFetchResult,
} from 'src/types/spindl';
import { callRequest } from 'src/utils/callRequest';
import { getLocale } from 'src/utils/getLocale';
import { getSpindlConfig } from './spindlConfig';

const FETCH_SPINDL_PATH = '/render/jumper';

export const fetchSpindl = async ({
  country,
  chainId,
  tokenAddress,
  address,
}: SpindlFetchParams): Promise<SpindlFetchResult | undefined> => {
  const spindlConfig = getSpindlConfig();
  const locale = getLocale().split('-');

  if (!spindlConfig?.apiUrl || !spindlConfig.headers) {
    return;
  }

  const queryParams: Record<string, string> = {
    placement_id: 'notify_message',
    limit: '2',
    address: address || '',
    country: country || locale[1] || '',
    chain_id: chainId?.toString() || '',
    token_address: tokenAddress || '',
  };

  try {
    const jsonResponse: SpindlData = await callRequest({
      method: 'GET',
      path: FETCH_SPINDL_PATH,
      apiUrl: spindlConfig.apiUrl,
      queryParams,
      headers: spindlConfig.headers,
      errors: {
        missingParams: 'Spindl configuration is missing',
        error: 'HTTP error while fetching Spindl cards!',
      },
    });

    return {
      data: jsonResponse?.items,
    };
  } catch (error) {
    console.error('Error fetching Spindl cards:', error);
    return undefined;
  }
};
