import { describe, expect, it } from 'vitest';
import { formatValueWithConfig } from './formatNumbers';
import { APY_FORMAT_CONFIG } from './numbers/apy';

describe('formatValueWithConfig', () => {
  describe('with APY_FORMAT_CONFIG', () => {
    it('should format 0.02 as 2%', () => {
      expect(formatValueWithConfig(0.02, APY_FORMAT_CONFIG)).toBe('2%');
    });

    it('should format 0.1234 as 12.34%', () => {
      expect(formatValueWithConfig(0.1234, APY_FORMAT_CONFIG)).toBe('12.34%');
    });

    it('should format 0.12345 with max 2 fraction digits as 12.35%', () => {
      expect(formatValueWithConfig(0.12345, APY_FORMAT_CONFIG)).toBe('12.35%');
    });

    it('should format 0 as 0', () => {
      expect(formatValueWithConfig(0, APY_FORMAT_CONFIG)).toBe('0%');
    });

    it('should format 1 as 100%', () => {
      expect(formatValueWithConfig(1, APY_FORMAT_CONFIG)).toBe('100%');
    });
  });
});
