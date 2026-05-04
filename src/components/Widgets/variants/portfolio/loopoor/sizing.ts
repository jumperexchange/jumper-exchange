// Flash-loan sizing for a single-shot leverage open.
//
// Inputs use the Morpho-native number shapes so callers can pass values straight
// from the GraphQL/REST API without loss of precision:
//   - lltv is the LLTV as 1e18-scaled bigint (same form as market.lltv)
//   - oraclePrice is 1e36-scaled bigint (collateral → loan token),
//     matching IOracle.price() and state.price from the Morpho API.
//
// In loan-token units:
//   extraCollateral  = initialCollateral · (L − 1)
//   flashLoanAmount  = extraCollateral · oraclePrice / 1e36

import type { LoopoorMarket } from '@/types/jumper-backend';

const ORACLE_SCALE = 10n ** 36n;
const WAD = 10n ** 18n;
const SHARE_PRICE_E27_SCALE = 10n ** 27n;
const DEFAULT_SLIPPAGE = 0.005;
const DEFAULT_SAFETY_BUFFER = 0.95;
const DEFAULT_MIN_SHARE_PRICE_SAFETY = 0.99;

export type FlashLoanSizingInput = {
  market: LoopoorMarket;
  initialCollateral: bigint;
  leverageFactor: number;
  slippage?: number;
  safetyBuffer?: number;
  oraclePrice?: bigint;
};

export type FlashLoanSizingResult = {
  flashLoanAmount: bigint;
  extraCollateral: bigint;
  cappedLeverageFactor: number;
  minSharePriceE27: bigint;
};

export function computeMaxLeverageFactor(
  market: LoopoorMarket,
  opts: { slippage?: number; safetyBuffer?: number } = {},
): number {
  const slippage = opts.slippage ?? DEFAULT_SLIPPAGE;
  const safetyBuffer = opts.safetyBuffer ?? DEFAULT_SAFETY_BUFFER;
  const lltvFraction = Number(market.lltv) / 1e18;
  const targetLtv = lltvFraction * safetyBuffer;
  const denom = 1 - targetLtv * (1 - slippage);
  return denom > 0 ? 1 + targetLtv / denom : Number.POSITIVE_INFINITY;
}

export function sizeFlashLoan(
  input: FlashLoanSizingInput,
): FlashLoanSizingResult {
  const {
    market,
    initialCollateral,
    leverageFactor,
    slippage,
    safetyBuffer,
    oraclePrice,
  } = input;

  if (initialCollateral <= 0n) {
    throw new Error('Loopoor: initialCollateral must be > 0');
  }
  if (!Number.isFinite(leverageFactor) || leverageFactor <= 1) {
    throw new Error('Loopoor: leverageFactor must be > 1');
  }

  const maxLeverageFactor = computeMaxLeverageFactor(market, {
    slippage,
    safetyBuffer,
  });
  const cappedLeverageFactor = Math.min(leverageFactor, maxLeverageFactor);

  const extraCollateral = mulFloat(initialCollateral, cappedLeverageFactor - 1);

  const price = oraclePrice ?? BigInt(market.state.price);
  if (price <= 0n) {
    throw new Error('Loopoor: oracle price must be > 0');
  }

  const flashLoanAmount = (extraCollateral * price) / ORACLE_SCALE;
  const minSharePriceE27 = computeMinSharePriceE27(market);

  return {
    flashLoanAmount,
    extraCollateral,
    cappedLeverageFactor,
    minSharePriceE27,
  };
}

// Slippage guard on morphoBorrow: the adapter reverts if
// assets.divUp(sharesMinted) < minSharePriceE27.
// Returning safety·1e27 is safe — actual share accounting happens on-chain;
// this value only needs to be ≤ the on-chain share price for borrow to clear.
export function computeMinSharePriceE27(
  market: LoopoorMarket,
  safety = DEFAULT_MIN_SHARE_PRICE_SAFETY,
): bigint {
  const borrowAssets = BigInt(market.state.borrowAssets);
  const supplyAssets = BigInt(market.state.supplyAssets);
  if (borrowAssets === 0n || supplyAssets === 0n) {
    return mulFloat(SHARE_PRICE_E27_SCALE, safety);
  }
  return mulFloat(SHARE_PRICE_E27_SCALE, safety);
}

export function mulFloat(value: bigint, factor: number): bigint {
  if (!Number.isFinite(factor)) {
    throw new Error('Loopoor: factor must be finite');
  }
  const scaled = BigInt(Math.round(factor * Number(WAD)));
  return (value * scaled) / WAD;
}
