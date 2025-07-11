import { useMemo } from 'react';
import { WidgetConfig } from '@lifi/widget';
import merge from 'lodash/merge';

import { ConfigContext } from './types';
import {
  getRegisteredOverrideHooks,
  registerOverrideHook,
} from './overridesRegistry';

import { useBaseWidget } from './base/useBaseWidget';

import { useLanguageOverride } from './overrides/languageOverride';
import { useSubvariantOverride } from './overrides/subvariantOverride';
import { useFormOverride } from './overrides/formOverride';
import { useZapOverride } from './overrides/zapOverride';
import { useRPCOverride } from './overrides/rpcOverride';

registerOverrideHook('languageResources', useLanguageOverride);
registerOverrideHook('subvariant', useSubvariantOverride);
registerOverrideHook('form', useFormOverride);
registerOverrideHook('rpc', useRPCOverride);
registerOverrideHook('zap', useZapOverride);

function getOverrideNamesForContext(ctx: ConfigContext): string[] {
  const names = ['languageResources', 'subvariant', 'form'];
  if (ctx.includeZap && ctx.zapToAddress && ctx.zapProviders) {
    names.push('zap');
  } else {
    names.push('rpc');
  }
  return names;
}

export function useLiFiWidgetConfig(ctx: ConfigContext = {}): WidgetConfig {
  const base = useBaseWidget();
  const overrideHooks = getRegisteredOverrideHooks(
    getOverrideNamesForContext(ctx),
  );

  const overrides = overrideHooks.map((hook) => hook(ctx));

  return useMemo(() => {
    return merge({}, base, ...overrides, ctx.baseOverrides);
  }, [base, overrides, ctx.baseOverrides]);
}
