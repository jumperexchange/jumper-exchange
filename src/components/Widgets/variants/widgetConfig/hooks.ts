import { WidgetConfig } from '@lifi/widget';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import { useBaseWidget } from './base/useBaseWidget';
import { useFormOverride } from './overrides/formOverride';
import { useLanguageOverride } from './overrides/languageOverride';
import { useRPCOverride } from './overrides/rpcOverride';
import { useSubvariantOverride } from './overrides/subvariantOverride';
import { useVaultOverride } from './overrides/vaultOverride';
import { useZapOverride } from './overrides/zapOverride';
import {
  getRegisteredOverrideHooks,
  registerOverrideHook,
} from './overridesRegistry';
import { ConfigContext } from './types';

registerOverrideHook('languageResources', useLanguageOverride);
registerOverrideHook('subvariant', useSubvariantOverride);
registerOverrideHook('form', useFormOverride);
registerOverrideHook('rpc', useRPCOverride);
registerOverrideHook('zap', useZapOverride);
registerOverrideHook('vauts', useVaultOverride);

function getOverrideNamesForContext(ctx: ConfigContext): string[] {
  const names = ['languageResources', 'subvariant', 'form'];
  if (ctx.includeZap) {
    names.push('zap');
    names.push('vauts');
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
    });
  }, [base, overrides, ctx.baseOverrides]);
}
