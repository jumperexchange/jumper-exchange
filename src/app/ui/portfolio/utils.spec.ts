import { describe, it, expect } from 'vitest';
import { getEffectiveValueRange } from './utils';
import { DEFAULT_DEFI_POSITIONS_MIN_VALUE } from './constants';

describe('getEffectiveValueRange', () => {
  it('returns default min value when allValueRange min is below default', () => {
    const result = getEffectiveValueRange({ min: 0.1, max: 5 });

    expect(result.min).toBe(DEFAULT_DEFI_POSITIONS_MIN_VALUE);
    expect(result.max).toBe(5);
  });

  it('returns allValueRange min when it exceeds default', () => {
    const result = getEffectiveValueRange({ min: 2, max: 10 });

    expect(result.min).toBe(2);
    expect(result.max).toBe(10);
  });

  it('sets both min and max to default when both are below default', () => {
    const result = getEffectiveValueRange({ min: 0.1, max: 0.5 });

    expect(result.min).toBe(DEFAULT_DEFI_POSITIONS_MIN_VALUE);
    expect(result.max).toBe(DEFAULT_DEFI_POSITIONS_MIN_VALUE);
  });

  it('handles zero values', () => {
    const result = getEffectiveValueRange({ min: 0, max: 0 });

    expect(result.min).toBe(DEFAULT_DEFI_POSITIONS_MIN_VALUE);
    expect(result.max).toBe(DEFAULT_DEFI_POSITIONS_MIN_VALUE);
  });

  it('handles equal min and max above default', () => {
    const result = getEffectiveValueRange({ min: 5, max: 5 });

    expect(result.min).toBe(5);
    expect(result.max).toBe(5);
  });

  it('uses custom default min value when provided', () => {
    const customDefault = 5;
    const result = getEffectiveValueRange({ min: 2, max: 10 }, customDefault);

    expect(result.min).toBe(customDefault);
    expect(result.max).toBe(10);
  });
});
