export interface WidgetUrlParams {
  amount: string;
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
}

export function buildUrlParams(data: WidgetUrlParams): string {
  const params = new URLSearchParams({
    fromAmount: data.amount,
    fromChain: data.fromChain,
    fromToken: data.fromToken,
    toChain: data.toChain,
    toToken: data.toToken,
  });
  return `?${params.toString()}`;
}
