import { describe, it, expect } from 'vitest';
import { calculateVisibleYRange } from './utils';

type TestDataPoint = { date: string; value: number };

const createDataPoints = (values: number[]): TestDataPoint[] =>
  values.map((value, i) => ({ date: `2024-01-0${i + 1}`, value }));

describe('calculateVisibleYRange', () => {
  it('returns default range 0-1 for empty array', () => {
    const result = calculateVisibleYRange([]);

    expect(result).toEqual({
      minValue: 0,
      maxValue: 1,
      minValueWithOffset: 0,
      maxValueWithOffset: 1,
      isSymmetricRange: false,
      isNegative: false,
    });
  });

  it('applies 20% headroom for small positive value', () => {
    const result = calculateVisibleYRange(createDataPoints([0.5]));

    expect(result.minValue).toBe(0);
    expect(result.maxValue).toBe(0.6);
    expect(result.isNegative).toBe(false);
  });

  it('keeps min to same value for single small negative value', () => {
    const result = calculateVisibleYRange(createDataPoints([-0.5]));

    expect(result.minValue).toBe(-0.5);
    expect(result.maxValue).toBe(0);
    expect(result.isNegative).toBe(true);
  });

  it('applies 20% headroom for single large positive value', () => {
    const result = calculateVisibleYRange(createDataPoints([5]));

    expect(result.minValue).toBe(0);
    expect(result.maxValue).toBe(6);
    expect(result.isNegative).toBe(false);
  });

  it('sets maxValue to 0 for single large negative value', () => {
    const result = calculateVisibleYRange(createDataPoints([-5]));

    expect(result.minValue).toBe(-5);
    expect(result.maxValue).toBe(0);
    expect(result.isNegative).toBe(true);
  });

  it('spans 0 to max*1.2 for multiple positive values', () => {
    const result = calculateVisibleYRange(createDataPoints([5, 10]));

    expect(result.minValue).toBe(0);
    expect(result.maxValue).toBe(12);
    expect(result.isNegative).toBe(false);
  });

  it('spans max to 0 for multiple negative values', () => {
    const result = calculateVisibleYRange(createDataPoints([-10, -5]));

    expect(result.minValue).toBe(-10);
    expect(result.maxValue).toBe(0);
    expect(result.isNegative).toBe(true);
  });
});
