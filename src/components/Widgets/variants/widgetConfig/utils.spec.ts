import { describe, it, expect } from 'vitest';
import { resolveActiveNavigationTab, resolveWidgetKeyPrefix } from './utils';

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

describe('resolveWidgetKeyPrefix', () => {
  it('uses the variant key when there is no active tab', () => {
    expect(resolveWidgetKeyPrefix('advanced', undefined)).toBe('advanced');
  });

  it('keeps the variant key for non-namespaced tab switches', () => {
    expect(resolveWidgetKeyPrefix('advanced', 'swap-advanced')).toBe(
      'advanced',
    );
    expect(resolveWidgetKeyPrefix('advanced', 'bridge-advanced')).toBe(
      'advanced',
    );
    expect(resolveWidgetKeyPrefix('default', 'refuel')).toBe('default');
  });

  it('uses its own namespace for the limit tab', () => {
    expect(resolveWidgetKeyPrefix('advanced', 'limit')).toBe('limit');
  });

  it('uses its own namespace for the private tab', () => {
    expect(resolveWidgetKeyPrefix('default', 'private')).toBe('private');
  });
});
