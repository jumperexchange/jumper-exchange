import { WidgetConfig } from '@lifi/widget';
import merge from 'lodash/merge';
import { useMemo } from 'react';

import {
  getRegisteredOverrideHooks,
  registerOverrideHook,
} from './overridesRegistry';
import { ConfigContext } from './types';

import { useBaseWidget } from './base/useBaseWidget';

import { useAllowBridge } from './overrides/allowBridge';
import { useAllowExchange } from './overrides/allowExchange';
import { useFormOverride } from './overrides/formOverride';
import { useLanguageOverride } from './overrides/languageOverride';
import { useRPCOverride } from './overrides/rpcOverride';
import { useSubvariantOverride } from './overrides/subvariantOverride';
import { useZapOverride } from './overrides/zapOverride';

registerOverrideHook('languageResources', useLanguageOverride);
registerOverrideHook('subvariant', useSubvariantOverride);
registerOverrideHook('form', useFormOverride);
registerOverrideHook('rpc', useRPCOverride);
registerOverrideHook('zap', useZapOverride);
registerOverrideHook('allowBridge', useAllowBridge);
registerOverrideHook('allowExchange', useAllowExchange);

function getOverrideNamesForContext(ctx: ConfigContext): string[] {
  const names = [
    'languageResources',
    'subvariant',
    'form',
    'allowBridge',
    'allowExchange',
  ];
  if (ctx.includeZap) {
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
    return merge({}, base, ...overrides, ctx.baseOverrides, {
      hiddenUI: [
        ...(base.hiddenUI ?? []),
        ...(ctx.baseOverrides?.hiddenUI ?? []),
      ],
      theme: merge({}, base.theme ?? {}, ctx.theme ?? {}),
    });
  }, [base, overrides, ctx.baseOverrides]);
}
