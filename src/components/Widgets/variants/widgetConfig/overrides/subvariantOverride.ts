import { useMemo } from 'react';
import { TaskType } from 'src/types/strapi';
import { ConfigOverrideHook } from '../types';

export const useSubvariantOverride: ConfigOverrideHook = (ctx) => {
  return useMemo(() => {
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
  }, [ctx.taskType]);
};
