export function parseSearchParams(url: string) {
  const searchParams = new URL(url).searchParams;
  return {
    amount: searchParams.get('amount'),
    fromToken: searchParams.get('fromToken'),
    fromChainId: searchParams.get('fromChainId'),
    toToken: searchParams.get('toToken'),
    toChainId: searchParams.get('toChainId'),
    highlighted: searchParams.get('highlighted'),
    theme: searchParams.get('theme'),
    isSwap: searchParams.get('isSwap'),
    amountUSD: searchParams.get('amountUSD'),
  };
}
