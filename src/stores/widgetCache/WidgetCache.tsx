import type { StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { WidgetCacheState } from '@/types/widgetCache';

// ----------------------------------------------------------------------

const defaultSettings = {};

/*--  Use Zustand  --*/

export const useWidgetCache = createWithEqualityFn(
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
          },
        );
      },
      setTo(token: string, chainId: number) {
        set({
          toToken: token,
          toChainId: chainId,
        });
      },
    }
  ) as unknown as StateCreator<WidgetCacheState, [], [], WidgetCacheState>,
  shallow,
);
