import type { Route } from '@lifi/sdk';
import type { PnlShareCardInput } from './pnlShareCard';

/**
 * A selected quote alongside all the quotes that were available for the same
 * route request. Matches the LI.FI widget `routeSelected` event payload.
 */
export interface QuoteSelection {
  route: Route;
  routes: Route[];
}

/**
 * Minimum number of eligible quotes required before the median is considered
 * meaningful (JUMADV-1 open question).
 */
export const MIN_ELIGIBLE_QUOTES = 3;

/**
 * Minimum extra output, in USD, before the card is shown — the button only
 * appears when the trade beat the median by $10 or more (JUMADV-1).
 */
export const MIN_AMOUNT_WON_USD = 10;

/**
 * Tags applied to routes whose quote value has been simulated and can be
 * trusted for comparison.
 */
const SIMULATED_TAGS = ['SIMULATED_BY_EVM', 'SIMULATED_BY_COMPOSER'];

const normalize = (value?: string) =>
  value ? value.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

/**
 * A route is simulated when it carries one of the simulation tags. `tags` is
 * typed as `Order[]` upstream but carries these string tags at runtime.
 */
function isSimulatedQuote(route: Route): boolean {
  const tags = (route.tags as string[] | undefined) ?? [];
  return tags.some((tag) => SIMULATED_TAGS.includes(tag));
}

/**
 * Intent/RFQ solvers whose quoted value is trustworthy without simulation:
 * CowSwap and 1inch Fusion.
 */
function usesTrustedSolver(route: Route): boolean {
  return (route.steps ?? []).some((step) => {
    const identifiers = [
      step.tool,
      step.toolDetails?.key,
      step.toolDetails?.name,
    ].map(normalize);

    return identifiers.some(
      (id) => id.includes('cow') || id.includes('fusion'),
    );
  });
}

/**
 * Eligible quotes for the median are only those whose value can be trusted:
 * simulated quotes, plus CowSwap and 1inch Fusion.
 */
export function isEligibleQuote(route: Route): boolean {
  return isSimulatedQuote(route) || usesTrustedSolver(route);
}

/**
 * Value of a quote used for comparison: the received amount in USD.
 * Returns `null` when it cannot be parsed to a positive number.
 */
function quoteValueUSD(route: Route): number | null {
  const value = Number(route.toAmountUSD);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Derive "extra output" share card inputs from a route selection (JUMADV-1).
 *
 * The card is driven by how much better the selected route is versus the
 * median quote on the same route:
 *
 * 1. Take the eligible quotes (simulated, CowSwap, 1inch Fusion).
 * 2. Compute the median of their USD output values.
 * 3. Delta = selected quote value − median value.
 *
 * Returns `null` when the route is not a value-gaining conversion, when there
 * are fewer than {@link MIN_ELIGIBLE_QUOTES} eligible quotes, or when the delta
 * is below {@link MIN_AMOUNT_WON_USD}.
 *
 * - `amountWon`  -> extra USD value gained vs the median quote
 * - `swapSize`   -> total swap size in USD (amount spent)
 * - `fromToken`  -> symbol of the token spent
 * - `toToken`    -> symbol of the token received
 */
export function deriveExtraOutputCard(
  selection: QuoteSelection,
): Omit<PnlShareCardInput, 'referralCode'> | null {
  const { route: selected, routes } = selection;

  const fromSymbol = selected?.fromToken?.symbol;
  const toSymbol = selected?.toToken?.symbol;

  if (!fromSymbol || !toSymbol || fromSymbol === toSymbol) {
    return null;
  }

  const selectedValue = quoteValueUSD(selected);
  const swapSize = Number(selected.fromAmountUSD);

  if (selectedValue === null || !Number.isFinite(swapSize) || swapSize <= 0) {
    return null;
  }

  const eligibleValues = (routes ?? [])
    .filter(isEligibleQuote)
    .map(quoteValueUSD)
    .filter((value): value is number => value !== null);

  if (eligibleValues.length < MIN_ELIGIBLE_QUOTES) {
    return null;
  }

  const amountWon = Number((selectedValue - median(eligibleValues)).toFixed(2));

  if (amountWon < MIN_AMOUNT_WON_USD) {
    return null;
  }

  return {
    amountWon,
    swapSize,
    fromToken: fromSymbol,
    toToken: toSymbol,
  };
}

/**
 * Derive a card from a real route selection for **preview/testing only**,
 * relaxing the production gates ({@link MIN_ELIGIBLE_QUOTES} and
 * {@link MIN_AMOUNT_WON_USD}) so a card can be shown from whatever the widget
 * currently has selected. Falls back to all quotes when none are eligible, so
 * there is always a comparison baseline. Still returns `null` when the selected
 * route has no usable tokens/amounts.
 */
export function deriveExtraOutputCardPreview(
  selection: QuoteSelection,
): Omit<PnlShareCardInput, 'referralCode'> | null {
  const { route: selected, routes } = selection;

  const fromSymbol = selected?.fromToken?.symbol;
  const toSymbol = selected?.toToken?.symbol;
  const selectedValue = quoteValueUSD(selected);
  const swapSize = Number(selected?.fromAmountUSD);

  if (
    !fromSymbol ||
    !toSymbol ||
    selectedValue === null ||
    !Number.isFinite(swapSize) ||
    swapSize <= 0
  ) {
    return null;
  }

  const eligibleValues = (routes ?? [])
    .filter(isEligibleQuote)
    .map(quoteValueUSD)
    .filter((value): value is number => value !== null);

  const comparisonValues = eligibleValues.length
    ? eligibleValues
    : (routes ?? [])
        .map(quoteValueUSD)
        .filter((value): value is number => value !== null);

  const baseline = comparisonValues.length
    ? median(comparisonValues)
    : selectedValue;
  const amountWon = Number((selectedValue - baseline).toFixed(2));

  return {
    amountWon,
    swapSize,
    fromToken: fromSymbol,
    toToken: toSymbol,
  };
}

const routeTools = (route: Route) =>
  (route.steps ?? [])
    .map((step) => step.toolDetails?.name || step.tool)
    .filter(Boolean)
    .join(', ');

/**
 * Build a structured, human-readable breakdown of how a card would be derived
 * from a selection — quote-by-quote eligibility, values, the median baseline
 * and the resulting delta. For dev logging only.
 */
export function debugExtraOutputCard(selection: QuoteSelection) {
  const { route: selected, routes } = selection;
  const selectedValue = quoteValueUSD(selected);

  const quotes = (routes ?? []).map((route) => ({
    isSelected: route.id === selected?.id,
    tools: routeTools(route),
    tags: (route.tags as string[] | undefined) ?? [],
    simulated: isSimulatedQuote(route),
    trustedSolver: usesTrustedSolver(route),
    eligible: isEligibleQuote(route),
    toAmountUSD: route.toAmountUSD,
    valueUSD: quoteValueUSD(route),
  }));

  const eligibleValues = quotes
    .filter((q) => q.eligible)
    .map((q) => q.valueUSD)
    .filter((value): value is number => value !== null);
  const allValues = quotes
    .map((q) => q.valueUSD)
    .filter((value): value is number => value !== null);

  const baselineSource = eligibleValues.length
    ? 'eligible'
    : allValues.length
      ? 'all'
      : 'selected(no-comparison)';
  const comparisonValues = eligibleValues.length ? eligibleValues : allValues;
  const medianUSD = comparisonValues.length
    ? median(comparisonValues)
    : selectedValue;
  const amountWon =
    selectedValue !== null && medianUSD !== null
      ? Number((selectedValue - medianUSD).toFixed(2))
      : null;

  return {
    fromToken: selected?.fromToken?.symbol,
    toToken: selected?.toToken?.symbol,
    swapSizeUSD: Number(selected?.fromAmountUSD),
    selectedValueUSD: selectedValue,
    totalQuotes: quotes.length,
    eligibleCount: eligibleValues.length,
    baselineSource,
    medianUSD,
    amountWon,
    quotes,
  };
}
