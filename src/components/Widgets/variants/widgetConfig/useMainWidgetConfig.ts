import type { NavigationTabKey, WidgetConfig } from '@jumperexchange/widget';
import { ChainId } from '@jumperexchange/widget';
import { useMemo } from 'react';
import { tokens } from 'src/config/tokens';
import { ThemesMap } from 'src/const/themesMap';
import { useVerifiedTokens } from 'src/hooks/tokens/useVerifiedTokens';
import { useMemelist } from 'src/hooks/useMemelist';
import { useUrlParams } from 'src/hooks/useUrlParams';
import { themeAllowChains } from '../../Widget.types';
import type { HookDependencies, MainWidgetContext } from './types';
import { generateRouteLabel, resolveWidgetKeyPrefix } from './utils';
import envConfig from '@/config/env-config';

function toolsConfig(allow?: string[], deny?: string[]) {
  if (!allow && !deny) {
    return undefined;
  }

  let result: { allow?: string[]; deny?: string[] } = {};
  if (allow) {
    result = { ...result, allow };
  }
  if (deny) {
    result = { ...result, deny };
  }
  return result;
}

/**
 * Configuration hook for the main widget variant
 */
export function useMainWidgetConfig(
  context: MainWidgetContext,
  deps: HookDependencies,
  activeTabKey?: NavigationTabKey,
): Partial<WidgetConfig> {
  const { tokens: memeListTokens } = useMemelist({
    enabled: context.partnerName === ThemesMap.Memecoins,
  });

  const { denyBridges, denyExchanges } = useUrlParams();

  const verifiedTokens = useVerifiedTokens();

  const allowedChainsByVariant = useMemo(
    () => (context.partnerName === ThemesMap.Memecoins ? themeAllowChains : []),
    [context.partnerName],
  );

  return useMemo(() => {
    const isMemecoins = context.partnerName === ThemesMap.Memecoins;

    const _tokens = tokens || {};
    if (memeListTokens) {
      const currentAllowList = _tokens?.allow ?? [];
      const newAllowList = currentAllowList.concat(memeListTokens);
      _tokens.allow = newAllowList;
    }
    if (verifiedTokens?.length) {
      _tokens.verified = verifiedTokens;
    }

    const {
      key = '',
      uiVariant = 'compact',
      mode = 'default',
      navigationTabs,
    } = context.resolvedVariant ?? {};

    const config: Partial<WidgetConfig> = {
      keyPrefix: `jumper-${resolveWidgetKeyPrefix(key, activeTabKey)}`,
      variant: navigationTabs ? 'wide' : uiVariant,
      buildUrl: true,
      useRelayerRoutes: true,
      ...(navigationTabs
        ? { _navigationTabs: navigationTabs }
        : {
            mode: isMemecoins ? 'default' : mode,
            modeOptions: {},
          }),

      // UI configuration
      hiddenUI: {
        ...(deps.theme.configTheme?.hiddenUI ?? {}),
        appearance: true,
        language: true,
        poweredBy: true,
        walletMenu: true,
      },

      // Theme configuration
      theme: {
        ...deps.theme.widgetTheme.config.theme,
      },

      appearance: deps.theme.widgetTheme.config.appearance,

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
      bridges: toolsConfig(deps.theme.configTheme?.allowedBridges, denyBridges),
      exchanges: toolsConfig(
        deps.theme.configTheme?.allowedExchanges,
        denyExchanges,
      ),

      routeLabels: [
        generateRouteLabel(
          '1.5x points',
          deps.theme.muiTheme,
          'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperbloom.svg',
          'hyperbloom',
        ),
        generateRouteLabel(
          '1.5x points',
          deps.theme.muiTheme,
          'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperflow.svg',
          'hyperflow',
        ),
        generateRouteLabel(
          'Verified',
          deps.theme.muiTheme,
          `${envConfig.NEXT_PUBLIC_SITE_URL}/widget/widget-label-verified.png`,
          '',
          (route) =>
            (route.tags ?? [])?.some(
              (tag) =>
                tag.includes('SIMULATED_BY_EVM') ||
                tag.includes('SIMULATED_BY_COMPOSER'),
            ),
          'neutral',
        ),
      ],
    };

    if (
      context.bridgeConditions?.isAGWToNonABSChain ||
      context.bridgeConditions?.isPrivateSwapSelected
    ) {
      config.requiredUI = { ...config.requiredUI, toAddress: true };
    }

    if (
      context.bridgeConditions?.isBridgeFromHypeToArbNativeUSDC ||
      context.bridgeConditions?.isBridgeFromEvmToHype
    ) {
      config.hiddenUI = { ...config.hiddenUI, toAddress: true };
    }

    if (context.isSafeContext) {
      config.sdkConfig = {
        ...config.sdkConfig,
        routeOptions: {
          ...config.sdkConfig?.routeOptions,
          allowSwitchChain: false,
        },
      };
    } else if (!context.isConnectedAGW) {
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
    context.resolvedVariant,
    context.partnerName,
    context.allowChains,
    context.allowFromChains,
    context.allowToChains,
    context.isConnectedAGW,
    context.isSafeContext,
    context.bridgeConditions,
    deps.theme,
    memeListTokens,
    verifiedTokens,
    allowedChainsByVariant,
    denyBridges,
    denyExchanges,
    activeTabKey,
  ]);
}
