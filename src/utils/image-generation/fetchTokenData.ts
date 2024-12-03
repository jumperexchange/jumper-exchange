import type { ChainId } from '@lifi/sdk';
import { getToken } from '@lifi/sdk';

export async function fetchTokenData(
  chainId: string | null,
  tokenAddress: string | null,
) {
  if (!chainId || !tokenAddress) {
    return null;
  }
  try {
    return await getToken(parseInt(chainId) as ChainId, tokenAddress);
  } catch (error) {
    console.error(`Error fetching token data: ${error}`);
    return null;
  }
}
