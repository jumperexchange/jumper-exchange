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
  /** Symbol of the toToken (`composeTokenKey`). */
  toSymbol: string;
  /** Current USD price of the fromToken. */
  fromTokenUsdPrice: number | null;
  /** Current USD price of the toToken. */
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
 * The chart is USD-denominated per single token, so the value depends on which
 * token is shown:
 * - fromToken chart: `usdLine = canonicalPrice × toTokenUsdPrice`
 * - toToken chart:   `usdLine = (1 / canonicalPrice) × fromTokenUsdPrice`
 *
 * Returns undefined when the line can't be placed meaningfully (chart token is
 * neither side of the pair, a stale price from a different pair, or a missing
 * conversion rate).
 */
export function deriveLimitPriceLine({
  limitPrice,
  fromToken,
  toToken,
  activeSymbol,
  fromSymbol,
  toSymbol,
  fromTokenUsdPrice,
  toTokenUsdPrice,
}: DeriveLimitPriceLineParams): { price: number } | undefined {
  if (!limitPrice?.price || !sameToken(limitPrice, fromToken, toToken)) {
    return undefined;
  }
  const canonical = Number(limitPrice.price);
  if (!Number.isFinite(canonical) || canonical <= 0) {
    return undefined;
  }
  if (activeSymbol === fromSymbol && toTokenUsdPrice) {
    return { price: canonical * toTokenUsdPrice };
  }
  if (activeSymbol === toSymbol && fromTokenUsdPrice) {
    return { price: (1 / canonical) * fromTokenUsdPrice };
  }
  return undefined;
}
