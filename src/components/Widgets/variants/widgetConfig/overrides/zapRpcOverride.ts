import { ConfigOverrideHook } from '../types';
import { useZapRPC } from '../base/useZapRPC';

export const useZapOverride: ConfigOverrideHook = (ctx) => {
  return useZapRPC();
};
