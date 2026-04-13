import type { WidgetConfig } from '@lifi/widget';
import { ChainId, HiddenUI, RequiredUI } from '@lifi/widget';
import { useMemo } from 'react';
import { tokens } from 'src/config/tokens';
import { ThemesMap } from 'src/const/themesMap';
import { useMemelist } from 'src/hooks/useMemelist';
import { themeAllowChains } from '../../Widget.types';
import type { HookDependencies, MainWidgetContext } from './types';
import { generateRouteLabel } from './utils';

/**
 * Configuration hook for the main widget variant
 */
export function useMainWidgetConfig(
  context: MainWidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  const { tokens: memeListTokens } = useMemelist({
    enabled: context.partnerName === ThemesMap.Memecoins,
  });

  const allowedChainsByVariant = useMemo(
    () => (context.partnerName === ThemesMap.Memecoins ? themeAllowChains : []),
    [context.starterVariant, context.partnerName],
  );

  return useMemo(() => {
    const isMemecoins = context.partnerName === ThemesMap.Memecoins;

    const _tokens = tokens || {};
    if (memeListTokens) {
      const currentAllowList = _tokens?.allow ?? [];
      const newAllowList = currentAllowList.concat(memeListTokens);
      _tokens.allow = newAllowList;
    }

    const config: Partial<WidgetConfig> = {
      keyPrefix: `jumper-${context.starterVariant}`,
      // Variant configuration
      variant: context.starterVariant === 'refuel' ? 'compact' : 'wide',
      buildUrl: true,
      useRelayerRoutes: true,
      subvariant:
        context.starterVariant === 'buy' ||
        context.starterVariant === 'private' ||
        isMemecoins
          ? 'default'
          : context.starterVariant,
      subvariantOptions: {},

      // UI configuration
      hiddenUI: [
        ...(deps.theme.configTheme?.hiddenUI ?? []),
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],

      // Theme configuration
      theme: {
        ...deps.theme.widgetTheme.config.theme,
      },

      // Chain configuration
      chains: {
        ...(deps.theme.configTheme?.chains ?? {}),
        allow: context.allowChains,
        from: {
          allow: context.isConnectedAGW
            ? [ChainId.ABS]
            : context.allowFromChains || allowedChainsByVariant,
        },
        to: context.allowToChains
          ? { allow: context.allowToChains }
          : undefined,
      },

      // Token configuration
      tokens: _tokens,

      // Bridge and exchange configuration
      bridges: deps.theme.configTheme?.allowedBridges
        ? { allow: deps.theme.configTheme.allowedBridges }
        : undefined,
      exchanges: deps.theme.configTheme?.allowedExchanges
        ? { allow: deps.theme.configTheme?.allowedExchanges }
        : undefined,

      routeLabels: [
        generateRouteLabel(
          '1.5x points',
          'hyperbloom',
          deps.theme.muiTheme,
          'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperbloom.svg',
        ),
        generateRouteLabel(
          '1.5x points',
          'hyperflow',
          deps.theme.muiTheme,
          'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperflow.svg',
        ),
      ],
    };

    if (
      context.bridgeConditions?.isAGWToNonABSChain ||
      context.bridgeConditions?.isPrivateSwapSelected ||
      context.starterVariant === 'private'
    ) {
      config.requiredUI = [...(config.requiredUI || []), RequiredUI.ToAddress];
    }

    if (
      context.bridgeConditions?.isBridgeFromHypeToArbNativeUSDC ||
      context.bridgeConditions?.isBridgeFromEvmToHype
    ) {
      config.hiddenUI = [...(config.hiddenUI || []), HiddenUI.ToAddress];
    }

    if (!context.isConnectedAGW) {
      config.sdkConfig = {
        ...config.sdkConfig,
        routeOptions: {
          ...config.sdkConfig?.routeOptions,
          allowSwitchChain: true,
        },
      };
    }

    return config;
  }, [
    context.integrator,
    context.starterVariant,
    context.partnerName,
    context.allowChains,
    context.allowFromChains,
    context.allowToChains,
    context.isConnectedAGW,
    context.bridgeConditions,
    deps.theme,
    memeListTokens,
    allowedChainsByVariant,
  ]);
}
