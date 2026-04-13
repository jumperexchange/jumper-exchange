import type { PostTokensDto } from '@/types/jumper-backend';
import { makeClient } from './client';

export interface ProxyTokenBalance {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUSD: string;
  amount?: string;
}

export async function getProxyTokenBalances(
  body: PostTokensDto,
): Promise<ProxyTokenBalance[]> {
  const client = makeClient();
  const response =
    await client.v1.portfolioControllerGetProxyTokenBalancesV1(body);
  // NOTE: see LF-15589 - we are transforming data in the backend
  return response.data.data as ProxyTokenBalance[];
}
