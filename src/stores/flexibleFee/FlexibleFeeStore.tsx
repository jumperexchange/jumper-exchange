'use client';
import { ExtendedChain } from '@lifi/types';
import { createWithEqualityFn } from 'zustand/traditional';

interface FlexibleFeeState {
  ethPrice: number;
  balanceNative: number;
  balanceNativeInUSD: number;
  isEligible: boolean;
  activeChain: ExtendedChain | undefined;
  setEthPrice: (n: number) => void;
  setBalanceNative: (n: number) => void;
  setBalanceNativeInUSD: (n: number) => void;
  setIsEligible: (b: boolean) => void;
  setActiveChain: (e: ExtendedChain | undefined) => void;
}

export const useFlexibleFeeStore = createWithEqualityFn<FlexibleFeeState>(
  (set) => ({
    ethPrice: 0,
    balanceNative: 0,
    balanceNativeInUSD: 0,
    isEligible: false,
    activeChain: undefined,
    setEthPrice: (n) => set({ ethPrice: n }),
    setBalanceNative: (n) => set({ balanceNative: n }),
    setBalanceNativeInUSD: (n) => set({ balanceNativeInUSD: n }),
    setIsEligible: (b) => set({ isEligible: b }),
    setActiveChain: (e) => set({ activeChain: e }),
  }),
  Object.is,
);
