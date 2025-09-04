import { useMemo } from 'react';
import { ConfigOverrideHook } from '../types';

export const useAllowExchange: ConfigOverrideHook = (ctx) => {
  return useMemo(() => {
    if (!ctx.allowExchange) {
      return {};
    }

    return {
      exchanges: {
        allow: [ctx.allowExchange],
      },
    };
  }, [ctx.allowExchange]);
};
