import { JUMPER_URL } from '@/const/urls';

/**
 * Inputs used to build the "extra output" social share card, before they are
 * serialized into the `/api/share-pnl` query string.
 */
export interface PnlShareCardInput {
  /** Extra value gained versus the median quote, in USD. */
  amountWon: number;
  /** Total size of the swap, in USD. */
  swapSize: number;
  /** Symbol of the token spent, e.g. `USDC`. */
  fromToken: string;
  /** Symbol of the token received, e.g. `ETH`. */
  toToken: string;
  referralCode?: string;
}

/**
 * Serialize the card input into the query string shared by both the OG image
 * endpoint (`/api/share-pnl`) and the share landing page (`/share/pnl`).
 */
export function buildPnlShareParams(input: PnlShareCardInput): URLSearchParams {
  const params = new URLSearchParams({
    amountWon: String(input.amountWon),
    swapSize: String(input.swapSize),
    fromToken: input.fromToken,
    toToken: input.toToken,
  });

  if (input.referralCode) {
    params.set('referralCode', input.referralCode);
  }

  return params;
}

/**
 * Build the `/api/share-pnl` image URL for the given card input.
 *
 * @param input - the card data
 * @param origin - the site origin (defaults to the canonical Jumper URL)
 */
export function buildPnlShareImageUrl(
  input: PnlShareCardInput,
  origin: string = JUMPER_URL,
): string {
  return `${origin.replace(/\/+$/, '')}/api/share-pnl?${buildPnlShareParams(
    input,
  ).toString()}`;
}

/**
 * Build the share landing URL (`/share/pnl`) that is posted to X. The page
 * exposes the personalized `twitter:image` / `og:image` meta so X unfurls the
 * generated card, then redirects visitors to the Jumper referral link.
 *
 * @param input - the card data
 * @param origin - the site origin (defaults to the canonical Jumper URL)
 */
export function buildPnlShareLandingUrl(
  input: PnlShareCardInput,
  origin: string = JUMPER_URL,
): string {
  return `${origin.replace(/\/+$/, '')}/share/pnl?${buildPnlShareParams(
    input,
  ).toString()}`;
}

/**
 * Format a USD amount for the share card: KMB-compact, with exactly 2 decimals
 * for fractional values and none for whole numbers.
 *
 * e.g. `0.24` → `0.24`, `0.2` → `0.20`, `980` → `980`, `100.5` → `100.50`,
 * `120000` → `120K`, `1250000` → `1.25M`.
 */
export function formatUsdCompact(value: number): string {
  const isWhole = Number.isInteger(value);
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format the extra output amount with a leading `+$`, e.g. `+$0.24` / `+$1.2K`.
 */
export function formatAmountWon(value: number): string {
  return `+$${formatUsdCompact(value)}`;
}

/**
 * Format a swap size with a `$` prefix, e.g. `$100.29` / `$120K`.
 */
export function formatSwapSize(value: number): string {
  return `$${formatUsdCompact(value)}`;
}

/**
 * Build the shareable Jumper referral link that visitors are redirected to.
 */
export function buildPnlShareLink(referralCode?: string): string {
  const base = JUMPER_URL.replace(/\/+$/, '');
  return referralCode ? `${base}/?ref=${referralCode}` : base;
}
