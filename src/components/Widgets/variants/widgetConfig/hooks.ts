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
import { useZapOverride } from './overrides/zapRpcOverride';
import { useRouteLabelsOverride } from './overrides/routeLabelsOverride';
import { useVariantOverride } from './overrides/variantOverride';

registerOverrideHook('languageResources', useLanguageOverride);
registerOverrideHook('subvariant', useSubvariantOverride);
registerOverrideHook('form', useFormOverride);
registerOverrideHook('rpc', useRPCOverride);
registerOverrideHook('zap', useZapOverride);
registerOverrideHook('allowBridge', useAllowBridge);
registerOverrideHook('allowExchange', useAllowExchange);
registerOverrideHook('routeLabels', useRouteLabelsOverride);
registerOverrideHook('variant', useVariantOverride);

function getOverrideNamesForContext(ctx: ConfigContext): string[] {
  const names = [
    'languageResources',
    'subvariant',
    'form',
    'allowBridge',
    'allowExchange',
    'variant',
  ];
  if (ctx.includeZap) {
    names.push('zap');
  } else {
    names.push('rpc');
  }
  if (ctx.includeRouteLabels) {
    names.push('routeLabels');
  }
  if (ctx.useMainWidget) {
    names.push('variant');
  }
  if (ctx.includeZap) {
    names.push('zapWidget');
  }
  return names;
}

export function useLiFiWidgetConfig(ctx: ConfigContext = {}): WidgetConfig {
  const base = useBaseWidget(ctx);
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
