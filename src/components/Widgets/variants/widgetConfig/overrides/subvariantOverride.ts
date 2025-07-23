import { TaskType } from 'src/types/strapi';
import { ConfigOverrideHook } from '../types';
import { useMemo } from 'react';

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
