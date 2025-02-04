import type {
  SpindlData,
  SpindlFetchParams,
  SpindlFetchResult,
} from 'src/types/spindl';
import { getLocale } from 'src/utils/getLocale';

export const fetchSpindl = async ({
  country,
  chainId,
  tokenAddress,
  address,
}: Omit<SpindlFetchParams, 'enabled'>): Promise<SpindlFetchResult> => {
  const apiUrl = new URL(`https://e.spindlembed.com/v1/render/jumper`);
  apiUrl.searchParams.set('placement_id', 'notify_message');
  apiUrl.searchParams.set('limit', '2');
  const locale = getLocale().split('-');

  if (address) {
    // wallet address, in the form of 0x... (required)
    apiUrl.searchParams.set('address', address);
  }
  if (country || locale.length) {
    // country code (IN, US, etc.)
    apiUrl.searchParams.set('country', country || locale[1]); // todo: @tche where to get country code? --> Is this one required?
  }
  if (chainId) {
    // (Optional): The chain id (numeric, from https://chainlist.org)
    apiUrl.searchParams.set('chain_id', chainId.toString());
  }
  if (tokenAddress) {
    // (Optional): The contract address of the token (on the chain specified above)
    apiUrl.searchParams.set('token_address', tokenAddress);
  }

  try {
    if (process.env.NEXT_PUBLIC_SPINDL_API_KEY) {
      const response = await fetch(apiUrl.href, {
        method: 'GET',
        headers: {
          'X-API-ACCESS-KEY': process.env.NEXT_PUBLIC_SPINDL_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Type the response JSON as SpindlData
      const jsonResponse: SpindlData = await response.json();

      if (!jsonResponse || !jsonResponse.items) {
        return { isSuccess: false, isLoading: false };
      }

      return {
        data: jsonResponse.items, // Return only items if needed
        isSuccess: true,
        isLoading: false,
      };
    } else {
      console.error('Provide Spindl API key');
      return {
        data: undefined,
        isSuccess: false,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { isSuccess: false, isLoading: false };
  }
};
