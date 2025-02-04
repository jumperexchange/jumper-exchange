import type {
  SpindlData,
  SpindlFetchParams,
  SpindlFetchResult,
} from 'src/types/spindl';
import { getLocale } from 'src/utils/getLocale';
import { getSpindlConfig } from './spindlConfig';

const FETCH_SPINDL_PATH = '/render/jumper';

export const fetchSpindl = async ({
  country,
  chainId,
  tokenAddress,
  address,
}: Omit<SpindlFetchParams, 'enabled'>): Promise<
  SpindlFetchResult | undefined
> => {
  const spindlConfig = getSpindlConfig();

  if (!spindlConfig?.apiUrl || !spindlConfig.headers) {
    return;
  }

  const url = new URL(`${spindlConfig.apiUrl}${FETCH_SPINDL_PATH}`);
  url.searchParams.set('placement_id', 'notify_message');
  url.searchParams.set('limit', '2');
  const locale = getLocale().split('-');
  if (address) {
    // wallet address, in the form of 0x... (required)
    url.searchParams.set('address', address);
  }
  if (country || locale.length) {
    // country code (IN, US, etc.)
    url.searchParams.set('country', country || locale[1]);
  }
  if (chainId) {
    // (Optional): The chain id (numeric, from https://chainlist.org)
    url.searchParams.set('chain_id', chainId.toString());
  }
  if (tokenAddress) {
    // (Optional): The contract address of the token (on the chain specified above)
    url.searchParams.set('token_address', tokenAddress);
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: spindlConfig.headers,
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error while fetching Spindl cards! status: ${response.status}`,
    );
  }

  // Type the response JSON as SpindlData
  const jsonResponse: SpindlData = await response.json();

  return {
    data: jsonResponse?.items, // Return only items if needed
  };
};
