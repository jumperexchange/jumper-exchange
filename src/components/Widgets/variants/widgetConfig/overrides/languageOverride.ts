import { useLanguageResources } from '../base/useLanguageResources';
import { ConfigOverrideHook } from '../types';

export const useLanguageOverride: ConfigOverrideHook = (ctx) =>
  useLanguageResources(ctx);
