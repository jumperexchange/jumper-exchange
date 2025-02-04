import type { SpindlFetchParams } from 'src/types/spindl';
import { getLocale } from 'src/utils/getLocale';

const SPINDLE_TRACKING_PATH = '/external/track';
const FETCH_SPINDL_PATH = '/render/jumper';

export const getSpindlConfig = () => {
  const getUrl = ({
    address,
    country,
    chainId,
    tokenAddress,
  }: SpindlFetchParams) => {
    if (process.env.NEXT_PUBLIC_SPINDL_API_URL) {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_SPINDL_API_URL}${FETCH_SPINDL_PATH}`,
      );
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
      return url;
    } else {
      return;
    }
  };

  return {
    getUrl,
    postUrl: `${process.env.NEXT_PUBLIC_SPINDL_API_URL}${SPINDLE_TRACKING_PATH}`,
  };
};
