import { isPast } from 'date-fns';
import type { LimitOrder as Order, TokenDto } from '@/types/jumper-backend';
import { formatTokenAmount } from '@jumperexchange/widget';

const STABLE_SYMBOL_REGEX =
  /^(DAI|GHO|MNEE|AMPL|FEI|DJED|VAI|FLX|STDN|ESD|BAC|BUCK|DOLA|BRZ|QGOLD|MIM|FXD|ZARP|EDLC|ONC|MTR|MIMATIC|BLC|JPYC|SBC|KBC|TRYB|PAR|ISR|GYD|UXD|USDC|USDT|BUSD|FRAX|USDCe|USDe|FDUSD|USDT0|USDF|USDm|GUSDT|axlUSDC|HONEY|BYUSD|APEUSD|FEUSD|USD)$/i;

const STABLE_SYMBOL_FLEXIBLE_REGEX = /(USD|EUR|XAU|YEN|IDR|CHF|CAD|CNH|MXN)/i;

const isStableToken = (token: TokenDto): boolean => {
  if (token.coinKey && STABLE_SYMBOL_REGEX.test(token.coinKey)) {
    return true;
  }
  return (
    STABLE_SYMBOL_REGEX.test(token.symbol) ||
    STABLE_SYMBOL_FLEXIBLE_REGEX.test(token.symbol)
  );
};

/** Price of the non-stable token in the order's quote terms. */
export const getOrderLimitPrice = (order: Order): number | null => {
  const fromAmount = Number(
    formatTokenAmount(BigInt(order.fromAmount), order.fromToken.decimals),
  );
  const toAmount = Number(
    formatTokenAmount(BigInt(order.toAmount), order.toToken.decimals),
  );

  if (fromAmount <= 0 || toAmount <= 0) {
    return null;
  }

  if (isStableToken(order.fromToken)) {
    return fromAmount / toAmount;
  }

  return toAmount / fromAmount;
};

/**
 * Market price in the same units as getOrderLimitPrice: USD price of the
 * non-stable token when exactly one side is stable, otherwise the
 * toToken-per-fromToken ratio implied by both tokens' USD prices.
 */
export const getOrderMarketPrice = (order: Order): number | null => {
  const fromStable = isStableToken(order.fromToken);
  const toStable = isStableToken(order.toToken);

  let value: number | null = null;
  if (fromStable) {
    value = order.toToken.priceUSD ? Number(order.toToken.priceUSD) : null;
  } else if (toStable) {
    value = order.fromToken.priceUSD ? Number(order.fromToken.priceUSD) : null;
  } else if (order.fromToken.priceUSD && order.toToken.priceUSD) {
    value = Number(order.fromToken.priceUSD) / Number(order.toToken.priceUSD);
  }

  return value != null && Number.isFinite(value) && value > 0 ? value : null;
};

/**
 * Whether an order has effectively expired, even if the backend hasn't
 * updated `status` to `'expired'` yet.
 */
export const isOrderExpired = (order: Order): boolean =>
  order.status === 'expired' ||
  (order.status !== 'cancelled' &&
    order.status !== 'filled' &&
    !!order.validUntil &&
    isPast(new Date(order.validUntil * 1000)));

export const getOrderFilledPercent = (order: Order): number => {
  const total = BigInt(order.fromAmount);
  if (total === 0n) {
    return 0;
  }

  const filled = BigInt(order.filledFromAmount);
  return Math.min(100, Math.round(Number((filled * 10000n) / total) / 100));
};
