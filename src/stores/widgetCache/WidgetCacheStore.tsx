import type { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { WidgetCacheState } from '@/types/widgetCache';
import type { SettingsState } from '@/types/settings';

// ----------------------------------------------------------------------

const defaultSettings = {
  fromToken: undefined,
  fromChainId: undefined,
  toToken: undefined,
  toChainId: undefined,
};

/*--  Use Zustand  --*/

export const useWidgetCacheStore = createWithEqualityFn<WidgetCacheState>(
  (set, get) => ({
    ...defaultSettings,

    setFromToken(token: string) {
      set({
        fromToken: token,
      });
    },
    setFromChainId(chainId: number) {
      set({
        fromChainId: chainId,
      });
    },
    setFrom(token: string, chainId: number) {
      set({
        fromToken: token,
        fromChainId: chainId,
      });
    },
    setToToken(token: string) {
      set({
        toToken: token,
      });
    },
    setToChainId(chainId: number) {
      set({
        toChainId: chainId,
      });
    },
    setTo(token: string, chainId: number) {
      set({
        toToken: token,
        toChainId: chainId,
      });
    },
  }),
  shallow,
);
