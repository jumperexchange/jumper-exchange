import { describe, expect, it } from 'vitest';
import { isExpired } from './isExpired';

const NOW = Date.parse('2026-06-01T12:00:00.000Z');

describe('isExpired', () => {
  it('treats notifications without an expiresAt as never expired', () => {
    expect(isExpired({ expiresAt: null }, NOW)).toBe(false);
  });

  it('hides notifications whose expiresAt is in the past', () => {
    expect(isExpired({ expiresAt: '2026-06-01T11:59:59.999Z' }, NOW)).toBe(
      true,
    );
  });

  it('shows notifications whose expiresAt is in the future', () => {
    expect(isExpired({ expiresAt: '2026-06-01T12:00:00.001Z' }, NOW)).toBe(
      false,
    );
  });

  it('treats the exact boundary as not yet expired', () => {
    expect(isExpired({ expiresAt: '2026-06-01T12:00:00.000Z' }, NOW)).toBe(
      false,
    );
  });

  it('treats an unparseable expiresAt as never expired', () => {
    expect(isExpired({ expiresAt: 'not-a-date' }, NOW)).toBe(false);
  });
});
