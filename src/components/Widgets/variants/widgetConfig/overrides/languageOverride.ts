import { useLanguageResources } from '../base/useLanguageResources';
import { useMissionLanguageResources } from '../base/useMissionLanguageResources';
import { ConfigOverrideHook } from '../types';

export const useLanguageOverride: ConfigOverrideHook = (ctx) =>
  ctx.useMainWidget
    ? useLanguageResources(ctx)
    : useMissionLanguageResources(ctx);
