export const MIN_DISPLAY_VALUE_USD = 0.1;

export const roundDisplayValueUsd = (value: number): number =>
  isFinite(value) ? Number(value.toFixed(2)) : value;

type UsdValued = { amountUSD: number } | { netUsd: number };
export type DisplayValueInput = number | UsdValued;

const toUsd = (input: DisplayValueInput): number =>
  typeof input === 'number'
    ? input
    : 'netUsd' in input
      ? input.netUsd
      : input.amountUSD;

// "worth showing" — boundary is inclusive ($0.10 shows; below hides).
// Accepts a raw number, a balance object ({ amountUSD }), or a position
// object ({ netUsd }) so call sites don't need to reach into the field.
export const isValueWorthDisplaying = (input: DisplayValueInput): boolean =>
  roundDisplayValueUsd(toUsd(input)) >= MIN_DISPLAY_VALUE_USD;
