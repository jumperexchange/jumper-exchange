import { isPast } from 'date-fns';
import type { Order, TokenDto } from '@/types/jumper-limit-order';
import { formatTokenAmount } from '@lifi/widget';

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

/** Current USD price of the token the limit price is expressed against. */
export const getOrderMarketPrice = (order: Order): number | null => {
  const priceUSD = isStableToken(order.fromToken)
    ? order.toToken.priceUSD
    : isStableToken(order.toToken)
      ? order.fromToken.priceUSD
      : order.toToken.priceUSD;

  if (!priceUSD) {
    return null;
  }

  const value = Number(priceUSD);
  return Number.isFinite(value) && value > 0 ? value : null;
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
