import type { LimitPriceChanged } from '@jumperexchange/widget';
import type { BaseToken } from '@/types/tokens';

interface DeriveLimitPriceLineParams {
  /** Latest limit price emitted by the widget (canonical: toToken per fromToken). */
  limitPrice?: LimitPriceChanged;
  fromToken?: BaseToken;
  toToken?: BaseToken;
  /** Symbol currently displayed by the chart (a `composeTokenKey` value). */
  activeSymbol: string;
  /** Symbol of the fromToken (`composeTokenKey`). */
  fromSymbol: string;
  /** Current USD price of the toToken, used to convert the canonical ratio to USD. */
  toTokenUsdPrice: number | null;
}

const sameToken = (
  price: LimitPriceChanged,
  from?: BaseToken,
  to?: BaseToken,
): boolean =>
  !!from &&
  !!to &&
  price.fromChainId === from.chainId &&
  price.fromTokenAddress?.toLowerCase() === from.address.toLowerCase() &&
  price.toChainId === to.chainId &&
  price.toTokenAddress?.toLowerCase() === to.address.toLowerCase();

/**
 * Convert the widget's canonical limit price (toToken per fromToken) into a
 * USD value for the chart's horizontal price line.
 *
 * The chart is USD-denominated per single token, so the line only makes sense
 * on the fromToken chart: `usdLine = canonicalPrice × toTokenUsdPrice`. Returns
 * undefined when the line can't be placed meaningfully (wrong chart token, a
 * stale price from a different pair, or a missing conversion rate).
 */
export function deriveLimitPriceLine({
  limitPrice,
  fromToken,
  toToken,
  activeSymbol,
  fromSymbol,
  toTokenUsdPrice,
}: DeriveLimitPriceLineParams): { price: number } | undefined {
  if (!limitPrice?.price || activeSymbol !== fromSymbol) {
    return undefined;
  }
  if (!sameToken(limitPrice, fromToken, toToken)) {
    return undefined;
  }
  const canonical = Number(limitPrice.price);
  if (!Number.isFinite(canonical) || canonical <= 0 || !toTokenUsdPrice) {
    return undefined;
  }
  return { price: canonical * toTokenUsdPrice };
}
