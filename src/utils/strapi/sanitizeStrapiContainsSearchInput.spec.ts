import { describe, expect, it } from 'vitest';
import { sanitizeStrapiContainsSearchInput } from './sanitizeStrapiContainsSearchInput';

describe('sanitizeStrapiContainsSearchInput', () => {
  it('removes SQL LIKE wildcards and escape character', () => {
    expect(sanitizeStrapiContainsSearchInput('a%b_c\\d')).toBe('abcd');
  });

  it('returns empty string when input is only metacharacters', () => {
    expect(sanitizeStrapiContainsSearchInput('%')).toBe('');
    expect(sanitizeStrapiContainsSearchInput('___')).toBe('');
    expect(sanitizeStrapiContainsSearchInput('%_\\')).toBe('');
  });

  it('preserves normal search text', () => {
    expect(sanitizeStrapiContainsSearchInput('hello world')).toBe(
      'hello world',
    );
    expect(sanitizeStrapiContainsSearchInput('test-123')).toBe('test-123');
  });
});
