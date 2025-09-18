import { useMemo } from 'react';
import { TaskType } from 'src/types/strapi';
import { ConfigOverrideHook } from '../types';
import { ThemesMap } from 'src/const/themesMap';

export const useSubvariantOverride: ConfigOverrideHook = (ctx) => {
  return useMemo(() => {
    if (
      ctx.starterVariant === 'buy' ||
      ctx.partnerName === ThemesMap.Memecoins
    ) {
      return {
        subvariant: 'default',
        subvariantOptions: {
          wide: { enableChainSidebar: true },
        },
      };
    }

    if (ctx.useMainWidget) {
      return {
        subvariant: 'default',
        subvariantOptions: {
          wide: { enableChainSidebar: true },
        },
      };
    }

    if (ctx.taskType === TaskType.Zap || ctx.taskType === TaskType.Deposit) {
      return {
        subvariant: 'custom',
        subvariantOptions: {
          custom: 'deposit',
        },
      };
    }

    return {
      subvariant: 'default',
      subvariantOptions: undefined,
    };
  }, [ctx.taskType, ctx.starterVariant, ctx.partnerName]);
};
