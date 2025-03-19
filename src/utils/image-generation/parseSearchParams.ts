import {
  searchParamsSchema,
  type ValidatedSearchParams,
} from '../validation-schemas';

export function parseSearchParams(url: string): ValidatedSearchParams {
  const searchParams = new URL(url).searchParams;
  const rawParams = {
    amount: searchParams.get('amount'),
    fromToken: searchParams.get('fromToken'),
    fromChainId: searchParams.get('fromChainId'),
    toToken: searchParams.get('toToken'),
    toChainId: searchParams.get('toChainId'),
    highlighted: searchParams.get('highlighted'),
    theme: searchParams.get('theme') || 'light',
    isSwap: searchParams.get('isSwap') || 'false',
    amountUSD: searchParams.get('amountUSD'),
    chainName: searchParams.get('chainName'),
  };

  // Parse and validate the parameters
  const result = searchParamsSchema.safeParse(rawParams);

  if (!result.success) {
    throw new Error('Invalid swap request parameters');
  }

  return result.data;
}
