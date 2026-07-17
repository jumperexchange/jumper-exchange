'use client';

import type { LimitPriceChanged } from '@jumperexchange/widget';
import { createWithEqualityFn } from 'zustand/traditional';

interface LimitOrderPriceState {
  /** Latest limit price emitted by the widget, with its token context. */
  limitPrice?: LimitPriceChanged;
  setLimitPrice: (limitPrice?: LimitPriceChanged) => void;
}

export const useLimitOrderPriceStore =
  createWithEqualityFn<LimitOrderPriceState>(
    (set) => ({
      limitPrice: undefined,
      setLimitPrice: (limitPrice) => set({ limitPrice }),
    }),
    Object.is,
  );
