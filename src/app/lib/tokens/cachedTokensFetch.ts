import { unstable_cache } from 'next/cache';
import type { ChainId } from '@lifi/sdk';
import {
  getTokensQuery,
  getChainTokensQuery,
} from '@/app/lib/tokens/tokenQueries';

const TOKENS_REVALIDATE_SECONDS = 300;

export const fetchTokensForPage = () =>
  unstable_cache(() => getTokensQuery(), ['tokens'], {
    revalidate: TOKENS_REVALIDATE_SECONDS,
  })();

export const fetchChainTokensForPage = (chainId: ChainId) =>
  unstable_cache(
    () => getChainTokensQuery(chainId),
    ['chain-tokens', String(chainId)],
    { revalidate: TOKENS_REVALIDATE_SECONDS },
  )();
