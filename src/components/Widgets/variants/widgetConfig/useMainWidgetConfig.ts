import { useMemo } from 'react';
import { WidgetConfig, HiddenUI } from '@lifi/widget';
import { ThemesMap } from 'src/const/themesMap';
import { MainWidgetContext, HookDependencies } from './types';
import { useMemelist } from 'src/hooks/useMemelist';
import { tokens } from 'src/config/tokens';

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

  return useMemo(() => {
    const isMemecoins = context.partnerName === ThemesMap.Memecoins;
    const isBuyVariant = context.starterVariant === 'buy';

    const _tokens = tokens || {};
    if (memeListTokens) {
      const currentAllowList = _tokens?.allow ?? [];
      const newAllowList = currentAllowList.concat(memeListTokens);
      _tokens.allow = newAllowList;
    }

    return {
      keyPrefix: `jumper-${context.starterVariant}`,
      // Variant configuration
      variant: context.starterVariant === 'refuel' ? 'compact' : 'wide',
      buildUrl: true,
      useRelayerRoutes: true,
      subvariant:
        isBuyVariant || isMemecoins
          ? 'default'
          : context.starterVariant === 'buy'
            ? 'default'
            : context.starterVariant,
      subvariantOptions: {
        wide: { enableChainSidebar: true },
      },

      // UI configuration
      hiddenUI: [
        ...(deps.theme.configTheme?.hiddenUI ?? []),
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],
      appearance: deps.theme.widgetTheme.config.appearance,

      // Theme configuration
      theme: {
        ...deps.theme.widgetTheme.config.theme,
      },

      // Chain configuration
      chains: {
        ...(deps.theme.configTheme?.chains ?? {}),
        allow: context.allowChains,
        from: context.allowFromChains
          ? {
              allow: context.allowFromChains,
            }
          : undefined,
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
        {
          label: {
            text: '1.5x points',
            sx: {
              order: 1,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginLeft: 'auto',
              gap: deps.theme.muiTheme.spacing(0.5),
              paddingLeft: deps.theme.muiTheme.spacing(0.5),
              paddingRight: deps.theme.muiTheme.spacing(0.5),
              background: `linear-gradient(90deg, ${(deps.theme.muiTheme.vars || deps.theme.muiTheme).palette.orchid[600]} 0%, ${(deps.theme.muiTheme.vars || deps.theme.muiTheme).palette.lavenderDark[300]} 100%)`,
              color: (deps.theme.muiTheme.vars || deps.theme.muiTheme).palette
                .white.main,
              ...deps.theme.muiTheme.typography.bodyXSmallStrong,
              ...deps.theme.muiTheme.applyStyles('light', {
                // @Note we might adjust to use the theme config
                background: 'linear-gradient(90deg, #9B006F 0%, #37006B 100%)',
              }),
              '&::before': {
                content: '""',
                width: '16px',
                height: '16px',
                borderRadius: '50%', // Makes the icon circular
                backgroundImage:
                  'url(https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperbloom.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                flexShrink: 0,
              },
              '&>p': {
                alignContent: 'flex-end',
                paddingLeft: deps.theme.muiTheme.spacing(0.5),
                paddingRight: deps.theme.muiTheme.spacing(0.5),
              },
            },
          },
          exchanges: {
            allow: ['hyperbloom'],
          },
        },
        {
          label: {
            text: '1.5x points',
            sx: {
              order: 1,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginLeft: 'auto',
              gap: deps.theme.muiTheme.spacing(0.5),
              paddingLeft: deps.theme.muiTheme.spacing(0.5),
              paddingRight: deps.theme.muiTheme.spacing(0.5),
              background: `linear-gradient(90deg, ${(deps.theme.muiTheme.vars || deps.theme.muiTheme).palette.orchid[600]} 0%, ${(deps.theme.muiTheme.vars || deps.theme.muiTheme).palette.lavenderDark[300]} 100%)`,
              color: (deps.theme.muiTheme.vars || deps.theme.muiTheme).palette
                .white.main,
              ...deps.theme.muiTheme.typography.bodyXSmallStrong,
              ...deps.theme.muiTheme.applyStyles('light', {
                // @Note we might adjust to use the theme config
                background: 'linear-gradient(90deg, #9B006F 0%, #37006B 100%)',
              }),
              '&::before': {
                content: '""',
                width: '16px',
                height: '16px',
                borderRadius: '50%', // Makes the icon circular
                backgroundImage:
                  'url(https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/hyperflow.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                flexShrink: 0,
              },
              '&>p': {
                alignContent: 'flex-end',
                paddingLeft: deps.theme.muiTheme.spacing(0.5),
                paddingRight: deps.theme.muiTheme.spacing(0.5),
              },
            },
          },
          exchanges: {
            allow: ['hyperflow'],
          },
        },
      ],
    };
  }, [
    context.integrator,
    context.starterVariant,
    context.partnerName,
    context.allowChains,
    context.allowToChains,
    deps.theme,
    memeListTokens,
  ]);
}
