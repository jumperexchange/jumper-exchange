import { ConfigOverrideHook } from '../types';
import { useZapWidget } from '../base/useZapWidget';

export const useZapWidgetOverride: ConfigOverrideHook = (ctx) => {
  return useZapWidget();
};
