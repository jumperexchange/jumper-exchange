import { useMemo } from 'react';
import { ConfigContext } from '../types';
import { WidgetConfig } from '@lifi/widget';

export const useVariantOverride = (
  ctx: ConfigContext,
): Partial<WidgetConfig> => {
  return useMemo(() => {
    if (!ctx.useMainWidget) {
      return {
        variant: 'compact',
      };
    }

    return {
      variant:
        // @ts-expect-error
        ctx.starterVariant === 'compact'
          ? 'compact'
          : ctx.starterVariant === 'refuel'
            ? 'compact'
            : 'wide',
    };
  }, [ctx.starterVariant, ctx.useMainWidget]);
};
