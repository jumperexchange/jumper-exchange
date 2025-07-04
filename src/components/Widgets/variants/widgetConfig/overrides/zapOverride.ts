import { ConfigOverrideHook } from '../types';
import { useZapRPC } from '../base/useZapRPC';

export const useZapOverride: ConfigOverrideHook = (ctx) => {
  const enabled = ctx.includeZap && !!ctx.zapToAddress && !!ctx.zapProviders;
  return useZapRPC(ctx.zapProviders ?? [], ctx.zapToAddress ?? '0x', enabled);
};
