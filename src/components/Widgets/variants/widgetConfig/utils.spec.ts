import { describe, it, expect } from 'vitest';
import { resolveActiveNavigationTab } from './utils';

describe('resolveActiveNavigationTab', () => {
  it('ignores the global tab for an instance that does not own navigation tabs', () => {
    expect(
      resolveActiveNavigationTab({
        type: 'limit',
        resolvedVariant: undefined,
        globalActiveNavigationTab: 'private',
      }),
    ).toBeUndefined();
  });

  it('returns undefined for a main-type variant with no navigationTabs', () => {
    expect(
      resolveActiveNavigationTab({
        type: 'main',
        resolvedVariant: { key: 'swap', uiVariant: 'compact', mode: 'default' },
        globalActiveNavigationTab: 'limit',
      }),
    ).toBeUndefined();
  });

  it('returns the global tab when the main widget owns it', () => {
    expect(
      resolveActiveNavigationTab({
        type: 'main',
        resolvedVariant: {
          key: 'advanced',
          uiVariant: 'wide',
          mode: 'default',
          navigationTabs: ['swap-advanced', 'bridge-advanced', 'limit'],
        },
        globalActiveNavigationTab: 'limit',
      }),
    ).toBe('limit');
  });

  it('falls back to the first navigation tab when the global tab is not owned', () => {
    expect(
      resolveActiveNavigationTab({
        type: 'main',
        resolvedVariant: {
          key: 'advanced',
          uiVariant: 'wide',
          mode: 'default',
          navigationTabs: ['swap-advanced', 'bridge-advanced', 'limit'],
        },
        globalActiveNavigationTab: 'private',
      }),
    ).toBe('swap-advanced');
  });
});
