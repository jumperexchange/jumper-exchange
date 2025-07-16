import { useBaseRPC } from '../base/useBaseRPC';
import { ConfigOverrideHook } from '../types';

export const useRPCOverride: ConfigOverrideHook = () => useBaseRPC();
