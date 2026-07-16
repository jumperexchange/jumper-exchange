import { cacheLife } from 'next/cache';
import type { ChainId } from '@lifi/sdk';
import {
  getTokensQuery,
  getChainTokensQuery,
} from '@/app/lib/tokens/tokenQueries';

const TOKENS_REVALIDATE_SECONDS = 300;

export async function fetchTokensForPage() {
  'use cache';
  cacheLife({ revalidate: TOKENS_REVALIDATE_SECONDS });
  return getTokensQuery();
}

export async function fetchChainTokensForPage(chainId: ChainId) {
  'use cache';
  cacheLife({ revalidate: TOKENS_REVALIDATE_SECONDS });
  return getChainTokensQuery(chainId);
}
