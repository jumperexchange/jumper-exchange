// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useUrlParams } from './useUrlParams';

const setSearch = (search: string) => {
  window.history.replaceState({}, '', `/${search}`);
};

describe('useUrlParams', () => {
  beforeEach(() => {
    setSearch('');
  });

  afterEach(() => {
    setSearch('');
  });

  it('returns undefined fields when no query params are present', () => {
    const { result } = renderHook(() => useUrlParams());

    expect(result.current).toEqual({
      sourceChainToken: { chainId: undefined, token: undefined },
      destinationChainToken: { chainId: undefined, token: undefined },
      toAddress: undefined,
      fromAmount: undefined,
      denyBridges: undefined,
      denyExchanges: undefined,
    });
  });

  it('parses chain, token, address, and amount params', () => {
    setSearch(
      '?fromChain=1&toChain=100&fromToken=0xfrom&toToken=0xto&toAddress=0xrecipient&fromAmount=1.5',
    );

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.sourceChainToken).toEqual({
      chainId: 1,
      token: '0xfrom',
    });
    expect(result.current.destinationChainToken).toEqual({
      chainId: 100,
      token: '0xto',
    });
    expect(result.current.toAddress).toBe('0xrecipient');
    expect(result.current.fromAmount).toBe('1.5');
  });

  it('parses denyBridges and denyExchanges as comma-separated lists', () => {
    setSearch(
      '?denyBridges=stargate,relay,nearintents&denyExchanges=hyperbloom,hyperflow',
    );

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.denyBridges).toEqual([
      'stargate',
      'relay',
      'nearintents',
    ]);
    expect(result.current.denyExchanges).toEqual(['hyperbloom', 'hyperflow']);
  });

  it('trims whitespace and drops empty entries from deny lists', () => {
    setSearch('?denyBridges= stargate , ,relay , &denyExchanges=,,hyperbloom,');

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.denyBridges).toEqual(['stargate', 'relay']);
    expect(result.current.denyExchanges).toEqual(['hyperbloom']);
  });

  it('returns undefined deny lists when params are absent or empty', () => {
    setSearch('?denyBridges=&denyExchanges=');

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.denyBridges).toBeUndefined();
    expect(result.current.denyExchanges).toBeUndefined();
  });

  it('updates on popstate when the URL changes', () => {
    setSearch('?denyBridges=stargate');

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.denyBridges).toEqual(['stargate']);

    act(() => {
      setSearch('?denyBridges=relay,across');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.denyBridges).toEqual(['relay', 'across']);
  });

  it('updates when the widget syncs the URL via history.replaceState', async () => {
    const { result } = renderHook(() => useUrlParams());

    expect(result.current.sourceChainToken).toEqual({
      chainId: undefined,
      token: undefined,
    });

    await act(async () => {
      window.history.replaceState({}, '', '/?fromChain=1&fromToken=0xfrom');
      await Promise.resolve();
    });

    expect(result.current.sourceChainToken).toEqual({
      chainId: 1,
      token: '0xfrom',
    });
  });

  it('updates when the widget syncs the URL via history.pushState', async () => {
    const { result } = renderHook(() => useUrlParams());

    await act(async () => {
      window.history.pushState({}, '', '/?toChain=100&toToken=0xto');
      await Promise.resolve();
    });

    expect(result.current.destinationChainToken).toEqual({
      chainId: 100,
      token: '0xto',
    });
  });

  it('keeps the same object reference when replaceState does not change parsed params', async () => {
    setSearch('?fromChain=1&fromToken=0xfrom');

    const { result } = renderHook(() => useUrlParams());
    const first = result.current;

    await act(async () => {
      window.history.replaceState({}, '', '/?fromChain=1&fromToken=0xfrom');
      await Promise.resolve();
    });

    expect(result.current).toBe(first);
  });
});
