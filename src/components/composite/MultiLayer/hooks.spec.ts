// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePendingFilters } from './hooks';

interface TestValues {
  chains: string[];
  assets: string[];
  [key: string]: string[];
}

const emptyValues: TestValues = { chains: [], assets: [] };

describe('usePendingFilters', () => {
  it('clearAll resets pending-only selections when nothing was applied', () => {
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      usePendingFilters<TestValues>({
        initialValues: emptyValues,
        onApply: vi.fn(),
        onClear,
      }),
    );

    act(() => {
      result.current.setPendingValue('chains', ['1', '137']);
    });
    expect(result.current.pendingValues.chains).toEqual(['1', '137']);

    act(() => {
      result.current.clearAll();
    });
    expect(onClear).toHaveBeenCalledOnce();
    expect(result.current.pendingValues).toEqual(emptyValues);
  });

  it('clearAll syncs pending values once applied filters clear', () => {
    const applied: TestValues = { chains: ['1'], assets: [] };
    const { result, rerender } = renderHook(
      ({ initialValues }: { initialValues: TestValues }) =>
        usePendingFilters<TestValues>({
          initialValues,
          onApply: vi.fn(),
          onClear: vi.fn(),
        }),
      { initialProps: { initialValues: applied } },
    );

    act(() => {
      result.current.clearAll();
    });
    rerender({ initialValues: emptyValues });
    expect(result.current.pendingValues).toEqual(emptyValues);
  });
});
