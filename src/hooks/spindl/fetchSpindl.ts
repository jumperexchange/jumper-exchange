import type {
  SpindlData,
  SpindlFetchParams,
  SpindlFetchResult,
} from 'src/types/spindl';
import { getSpindlConfig } from './spindlConfig';

export const fetchSpindl = async ({
  country,
  chainId,
  tokenAddress,
  address,
}: Omit<SpindlFetchParams, 'enabled'>): Promise<SpindlFetchResult> => {
  const { getUrl } = getSpindlConfig();
  const url = getUrl({ address, country, chainId, tokenAddress });

  if (!url || !process.env.NEXT_PUBLIC_SPINDL_API_KEY) {
    return {
      data: undefined,
    };
  }
  const response = await fetch(url.href, {
    method: 'GET',
    headers: {
      'X-API-ACCESS-KEY': process.env.NEXT_PUBLIC_SPINDL_API_KEY,
    },
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
