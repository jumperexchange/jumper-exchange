import { useMemo } from 'react';
import { ConfigOverrideHook } from '../types';

export const useAllowBridge: ConfigOverrideHook = (ctx) => {
  return useMemo(() => {
    if (!ctx.allowBridge) {
      return {};
    }

    return {
      bridges: {
        allow: [ctx.allowBridge],
      },
    };
  }, [ctx.allowBridge]);
};
