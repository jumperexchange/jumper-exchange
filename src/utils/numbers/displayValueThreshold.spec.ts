import { describe, expect, it } from 'vitest';
import {
  MIN_DISPLAY_VALUE_USD,
  isValueWorthDisplaying,
  roundDisplayValueUsd,
} from './displayValueThreshold';

describe('roundDisplayValueUsd', () => {
  it('rounds to two decimals', () => {
    expect(roundDisplayValueUsd(0.099)).toBe(0.1);
    expect(roundDisplayValueUsd(0.094)).toBe(0.09);
    expect(roundDisplayValueUsd(1.005)).toBe(1);
  });

  it('passes through non-finite values unchanged', () => {
    expect(roundDisplayValueUsd(Infinity)).toBe(Infinity);
    expect(roundDisplayValueUsd(-Infinity)).toBe(-Infinity);
    expect(roundDisplayValueUsd(NaN)).toBeNaN();
  });
});

describe('isValueWorthDisplaying', () => {
  it('hides values below the $0.10 floor', () => {
    expect(isValueWorthDisplaying(0)).toBe(false);
    expect(isValueWorthDisplaying(0.09)).toBe(false);
    expect(isValueWorthDisplaying(0.094)).toBe(false);
  });

  it('shows values that round up to the inclusive boundary', () => {
    expect(isValueWorthDisplaying(0.099)).toBe(true);
    expect(isValueWorthDisplaying(MIN_DISPLAY_VALUE_USD)).toBe(true);
    expect(isValueWorthDisplaying(0.1)).toBe(true);
  });

  it('shows values comfortably above the floor', () => {
    expect(isValueWorthDisplaying(1)).toBe(true);
    expect(isValueWorthDisplaying(1234.56)).toBe(true);
  });

  it('shows Infinity and hides NaN', () => {
    expect(isValueWorthDisplaying(Infinity)).toBe(true);
    expect(isValueWorthDisplaying(NaN)).toBe(false);
  });
});
