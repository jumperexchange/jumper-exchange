// @vitest-environment jsdom

import { ChainId } from '@lifi/sdk';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ETH_NATIVE, ETH_USDC, SOL_USDC } from '@/config/tokens';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { useFormParameters } from './hooks';

vi.mock('@/stores/theme', () => ({
  useThemeStore: (selector: (state: { configTheme: undefined }) => unknown) =>
    selector({ configTheme: undefined }),
}));

const setSearch = (search: string) => {
  window.history.replaceState({}, '', search ? `/${search}` : '/');
};

describe('useFormParameters', () => {
  beforeEach(() => {
    setSearch('');
    useWidgetCacheStore.setState({
      fromToken: undefined,
      fromChainId: undefined,
      toToken: undefined,
      toChainId: undefined,
    });
  });

  it('falls back to main-widget placeholders when nothing else is set', () => {
    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'default',
      }),
    );

    expect(result.current).toEqual({
      sourceChain: { chainId: String(ChainId.ETH), chainKey: '' },
      sourceToken: { tokenAddress: ETH_USDC, tokenSymbol: '' },
      destinationChain: { chainId: String(ChainId.SOL), chainKey: '' },
      destinationToken: { tokenAddress: SOL_USDC, tokenSymbol: '' },
    });
  });

  it('uses advanced swap placeholders for the swap-advanced tab', () => {
    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'advanced',
        activeTabKey: 'swap-advanced',
      }),
    );

    expect(result.current).toEqual({
      sourceChain: { chainId: String(ChainId.ETH), chainKey: '' },
      sourceToken: { tokenAddress: ETH_NATIVE, tokenSymbol: '' },
      destinationChain: { chainId: String(ChainId.ETH), chainKey: '' },
      destinationToken: { tokenAddress: ETH_USDC, tokenSymbol: '' },
    });
  });

  it('leaves Private and Gas empty', () => {
    const { result: privateResult } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'private',
      }),
    );
    const { result: gasResult } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'refuel',
      }),
    );

    expect(privateResult.current).toEqual({});
    expect(gasResult.current).toEqual({});
  });

  it('ignores URL on Private and Gas so Exchange pairs do not seed those tabs', () => {
    setSearch('?fromChain=42161&fromToken=0xarb&toChain=1&toToken=0xethusdc');

    const { result: gasResult } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'refuel',
      }),
    );

    expect(gasResult.current).toEqual({});
    expect(window.location.search).toContain('fromChain=42161');
  });

  it('prefers URL params over placeholders on cold load', () => {
    setSearch('?fromChain=42161&fromToken=0xarb&toChain=1&toToken=0xethusdc');

    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'default',
      }),
    );

    expect(result.current).toEqual({
      sourceChain: { chainId: '42161', chainKey: '' },
      sourceToken: { tokenAddress: '0xarb', tokenSymbol: '' },
      destinationChain: { chainId: '1', chainKey: '' },
      destinationToken: { tokenAddress: '0xethusdc', tokenSymbol: '' },
    });
  });

  it('prefers widget cache over placeholders (wallet balance card)', () => {
    act(() => {
      useWidgetCacheStore.getState().setFrom('0xcache', ChainId.ARB);
      useWidgetCacheStore.getState().setTo(ETH_USDC, ChainId.ETH);
    });

    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'default',
      }),
    );

    expect(result.current).toEqual({
      sourceChain: { chainId: String(ChainId.ARB), chainKey: '' },
      sourceToken: { tokenAddress: '0xcache', tokenSymbol: '' },
      destinationChain: { chainId: String(ChainId.ETH), chainKey: '' },
      destinationToken: { tokenAddress: ETH_USDC, tokenSymbol: '' },
    });
  });

  it('fills missing to-side from placeholders when wallet sets from-only cache', () => {
    act(() => {
      useWidgetCacheStore.getState().setFrom(ETH_USDC, ChainId.ETH);
    });

    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'advanced',
        activeTabKey: 'swap-advanced',
      }),
    );

    expect(result.current).toEqual({
      sourceChain: { chainId: String(ChainId.ETH), chainKey: '' },
      sourceToken: { tokenAddress: ETH_USDC, tokenSymbol: '' },
      destinationChain: { chainId: String(ChainId.ETH), chainKey: '' },
      destinationToken: { tokenAddress: ETH_USDC, tokenSymbol: '' },
    });
  });

  it('ignores empty-string cache tokens so placeholders still fill', () => {
    act(() => {
      useWidgetCacheStore.setState({
        fromToken: '',
        toToken: '',
        fromChainId: undefined,
        toChainId: undefined,
      });
    });

    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'default',
      }),
    );

    expect(result.current.sourceToken?.tokenAddress).toBe(ETH_USDC);
    expect(result.current.destinationToken?.tokenAddress).toBe(SOL_USDC);
  });

  it('does not pick up URL changes after the initial mount snapshot', () => {
    setSearch('?fromChain=1&fromToken=0xfirst&toChain=1&toToken=0xfirstto');

    const { result, rerender } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'default',
      }),
    );

    expect(result.current.sourceToken?.tokenAddress).toBe('0xfirst');

    setSearch('?fromChain=10&fromToken=0xsecond&toChain=10&toToken=0xsecondto');
    rerender();

    expect(result.current.sourceToken?.tokenAddress).toBe('0xfirst');
  });

  it('ignores junk URL chain params and falls back to placeholders', () => {
    setSearch('?fromChain=abc&fromToken=xyz&toChain=1&toToken=0xok');

    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'default',
      }),
    );

    expect(result.current).toEqual({
      sourceChain: { chainId: String(ChainId.ETH), chainKey: '' },
      sourceToken: { tokenAddress: ETH_USDC, tokenSymbol: '' },
      destinationChain: { chainId: '1', chainKey: '' },
      destinationToken: { tokenAddress: '0xok', tokenSymbol: '' },
    });
  });

  it('prefers explicit props over placeholders', () => {
    const { result } = renderHook(() =>
      useFormParameters({
        starterVariant: 'default',
        activeTabKey: 'default',
        fromChain: ChainId.OPT,
        fromToken: '0xprop',
        toChain: ChainId.BAS,
        toToken: '0xbas',
      }),
    );

    expect(result.current).toEqual({
      sourceChain: { chainId: String(ChainId.OPT), chainKey: '' },
      sourceToken: { tokenAddress: '0xprop', tokenSymbol: '' },
      destinationChain: { chainId: String(ChainId.BAS), chainKey: '' },
      destinationToken: { tokenAddress: '0xbas', tokenSymbol: '' },
    });
  });
});
