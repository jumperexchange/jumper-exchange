// @vitest-environment jsdom

import { ChainId } from '@lifi/sdk';
import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ETH_NATIVE, ETH_USDC, SOL_USDC } from '@/config/tokens';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import {
  applyWidgetChainTokenFields,
  clearUrlChainTokenParams,
  clearWidgetChainTokenCache,
  getUrlChainTokenParams,
  resolveActiveNavigationTab,
  resolveWidgetKeyPrefix,
  resolveWidgetPlaceholderTokens,
} from './utils';

const setSearch = (search: string) => {
  window.history.replaceState({}, '', search ? `/${search}` : '/');
};

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

describe('resolveWidgetPlaceholderTokens', () => {
  it('returns Ethereum USDC → Solana USDC for the main widget', () => {
    expect(resolveWidgetPlaceholderTokens('default')).toEqual({
      fromChain: ChainId.ETH,
      fromToken: ETH_USDC,
      toChain: ChainId.SOL,
      toToken: SOL_USDC,
    });
  });

  it('returns Ethereum ETH → USDC for advanced swap', () => {
    expect(resolveWidgetPlaceholderTokens('advanced', 'swap-advanced')).toEqual(
      {
        fromChain: ChainId.ETH,
        fromToken: ETH_NATIVE,
        toChain: ChainId.ETH,
        toToken: ETH_USDC,
      },
    );
  });

  it('returns Ethereum USDC → Solana USDC for advanced bridge', () => {
    expect(
      resolveWidgetPlaceholderTokens('advanced', 'bridge-advanced'),
    ).toEqual({
      fromChain: ChainId.ETH,
      fromToken: ETH_USDC,
      toChain: ChainId.SOL,
      toToken: SOL_USDC,
    });
  });

  it('returns Ethereum USDC → ETH for advanced limit', () => {
    expect(resolveWidgetPlaceholderTokens('advanced', 'limit')).toEqual({
      fromChain: ChainId.ETH,
      fromToken: ETH_USDC,
      toChain: ChainId.ETH,
      toToken: ETH_NATIVE,
    });
  });

  it('defaults advanced without a resolved tab to the swap pair', () => {
    expect(resolveWidgetPlaceholderTokens('advanced')).toEqual({
      fromChain: ChainId.ETH,
      fromToken: ETH_NATIVE,
      toChain: ChainId.ETH,
      toToken: ETH_USDC,
    });
  });

  it('returns undefined for compact variants without placeholders', () => {
    expect(resolveWidgetPlaceholderTokens('swap')).toBeUndefined();
    expect(resolveWidgetPlaceholderTokens('bridge')).toBeUndefined();
    expect(resolveWidgetPlaceholderTokens('blog')).toBeUndefined();
    expect(resolveWidgetPlaceholderTokens('refuel')).toBeUndefined();
  });

  it('does not seed placeholders on the Gas/refuel tab', () => {
    expect(resolveWidgetPlaceholderTokens('default', 'refuel')).toBeUndefined();
  });

  it('does not seed placeholders on the Private tab', () => {
    expect(
      resolveWidgetPlaceholderTokens('default', 'private'),
    ).toBeUndefined();
  });

  it('seeds only the Exchange tab on the default variant', () => {
    expect(resolveWidgetPlaceholderTokens('default', 'default')).toEqual({
      fromChain: ChainId.ETH,
      fromToken: ETH_USDC,
      toChain: ChainId.SOL,
      toToken: SOL_USDC,
    });
  });
});

describe('getUrlChainTokenParams', () => {
  beforeEach(() => {
    setSearch('');
  });

  it('parses from/to chain and token from the query string', () => {
    setSearch(
      '?fromChain=1&fromToken=0xfrom&toChain=1151111081099710&toToken=EPjFWdd5',
    );

    expect(getUrlChainTokenParams()).toEqual({
      fromChain: 1,
      fromToken: '0xfrom',
      toChain: 1151111081099710,
      toToken: 'EPjFWdd5',
    });
  });

  it('ignores non-numeric chain params so placeholders are not blocked', () => {
    setSearch('?fromChain=abc&fromToken=xyz&toChain=nope&toToken=zzz');

    expect(getUrlChainTokenParams()).toEqual({
      fromChain: undefined,
      fromToken: undefined,
      toChain: undefined,
      toToken: undefined,
    });
  });
});

describe('clearWidgetChainTokenCache', () => {
  it('clears cached from/to chain and token', () => {
    act(() => {
      useWidgetCacheStore.getState().setFrom('0xcache', ChainId.ARB);
      useWidgetCacheStore.getState().setTo(ETH_USDC, ChainId.ETH);
    });

    clearWidgetChainTokenCache();

    expect(useWidgetCacheStore.getState()).toMatchObject({
      fromToken: undefined,
      fromChainId: undefined,
      toToken: undefined,
      toChainId: undefined,
    });
  });
});

describe('clearUrlChainTokenParams', () => {
  beforeEach(() => {
    setSearch('');
  });

  it('removes from/to params and leaves unrelated query intact', () => {
    setSearch('?tab=gas&fromChain=1&fromToken=0x&toChain=1&toToken=0y&foo=1');

    clearUrlChainTokenParams();

    expect(window.location.search).toBe('?tab=gas&foo=1');
  });
});

describe('applyWidgetChainTokenFields', () => {
  beforeEach(() => {
    setSearch('');
  });

  it('writes placeholder pairs onto the form and URL', () => {
    const setFieldValue = vi.fn();

    applyWidgetChainTokenFields({ setFieldValue } as never, {
      fromChain: ChainId.ETH,
      fromToken: ETH_USDC,
      toChain: ChainId.SOL,
      toToken: SOL_USDC,
    });

    expect(setFieldValue.mock.calls).toEqual([
      ['fromChain', ChainId.ETH],
      ['fromToken', ETH_USDC],
      ['toChain', ChainId.SOL],
      ['toToken', SOL_USDC],
    ]);
    expect(getUrlChainTokenParams()).toEqual({
      fromChain: ChainId.ETH,
      fromToken: ETH_USDC,
      toChain: ChainId.SOL,
      toToken: SOL_USDC,
    });
  });

  it('clears from/to on the form and URL when tokens are null', () => {
    setSearch('?fromChain=1&fromToken=0x&toChain=1&toToken=0y&foo=1');
    const setFieldValue = vi.fn();

    applyWidgetChainTokenFields({ setFieldValue } as never, null);

    expect(setFieldValue.mock.calls).toEqual([
      ['fromChain', undefined],
      ['fromToken', undefined],
      ['toChain', undefined],
      ['toToken', undefined],
    ]);
    expect(window.location.search).toBe('?foo=1');
  });
});
