export const MIN_DISPLAY_VALUE_USD = 0.1;

export const roundDisplayValueUsd = (value: number): number =>
  isFinite(value) ? Number(value.toFixed(2)) : value;

// "worth showing" — boundary is inclusive ($0.10 shows; below hides)
export const isValueWorthDisplaying = (value: number): boolean =>
  roundDisplayValueUsd(value) >= MIN_DISPLAY_VALUE_USD;
