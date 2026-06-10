import type { ChainId } from '@lifi/sdk';
import { getToken } from '@lifi/sdk';
import { sdkClient } from '@/utils/instrumentation/lifiSdkConfig';

export async function fetchTokenData(
  chainId: string | null,
  token: string | null,
) {
  if (!chainId || !token) {
    return null;
  }
  try {
    return await getToken(sdkClient, parseInt(chainId) as ChainId, token);
  } catch (error) {
    console.error(`Error fetching token data: ${error}`);
    return null;
  }
}

export async function fetchTokenBySymbol(
  chainId: ChainId,
  symbol: string,
  signal?: AbortSignal,
) {
  try {
    return await getToken(sdkClient, chainId, symbol, { signal });
  } catch {
    return null;
  }
}
