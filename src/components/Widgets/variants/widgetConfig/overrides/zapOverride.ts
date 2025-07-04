import { ConfigOverrideHook } from '../types';

export const useZapOverride: ConfigOverrideHook = (ctx) => {
  if (ctx.includeZap && ctx.zapToAddress && ctx.zapProviders) {
    const { useZapRPC } = require('../base/useZapRPC');
    return useZapRPC(ctx.zapProviders, ctx.zapToAddress);
  }
  return {};
};
