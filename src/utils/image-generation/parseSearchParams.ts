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
    // If validation fails, return null for all fields except defaults
    return {
      amount: null,
      fromToken: null,
      fromChainId: null,
      toToken: null,
      toChainId: null,
      highlighted: null,
      theme: 'light', // Default theme
      isSwap: 'false', // Default isSwap
      amountUSD: null,
      chainName: null,
    };
  }

  return result.data;
}
