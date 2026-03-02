import type { FrontendAction } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';
import { ChainId, HiddenUI, RequiredUI } from '@lifi/widget';
import { peerExtensionSdk } from '@zkp2p/sdk';
import { useMemo } from 'react';
import { tokens } from 'src/config/tokens';
import { ThemesMap } from 'src/const/themesMap';
import { useMemelist } from 'src/hooks/useMemelist';
import { themeAllowChains } from '../../Widget.types';
import type { HookDependencies, MainWidgetContext } from './types';
import { generateRouteLabel } from './utils';
import getApiUrl from '@/utils/getApiUrl';

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
    const isBuyVariant = context.starterVariant === 'buy';

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
      sdkConfig: {
        executionOptions: {
          executeFrontendActionHook: async ({
            toolDetails,
            data,
          }: FrontendAction) => {
            if (toolDetails.key === 'zkp2p') {
              if (!data?.intentHash) {
                throw new Error(
                  'Missing intent hash for zkP2P frontend action',
                );
              }

              // Check the status of the intent, is it done ?
              const apiUrl = getApiUrl();
              const intentResponse = await fetch(
                `${apiUrl}/intent/status?intentHash=${data.intentHash}`,
                {
                  method: 'GET',
                },
              );
              if (intentResponse.ok) {
                const intentStatus = await intentResponse.json();
                if (intentStatus.status === 'FULFILLED') {
                  return null;
                }
              }

              // Peer extension handling
              const extensionState = await peerExtensionSdk.getState();
              if (extensionState === 'needs_install') {
                peerExtensionSdk.openInstallPage();
                throw new Error('Peer extension not installed');
              } else if (extensionState === 'needs_connection') {
                await peerExtensionSdk.requestConnection();
              } else {
                peerExtensionSdk.onramp({
                  intentHash: data.intentHash,
                });
              }

              return new Promise((resolve, reject) => {
                const unsubscribe = peerExtensionSdk.onProofComplete(
                  (result) => {
                    switch (result.status) {
                      case 'success': {
                        // Peer handles the on-chain execution themselves
                        return null;
                      }
                      case 'failure':
                        reject(
                          new Error(
                            `Peer Proof failed ${result.error?.message}`,
                          ),
                        );
                        break;
                      case 'cancelled':
                        reject(new Error(`User cancelled`));
                        break;
                      case 'timeout':
                        reject(new Error('Proof timed out'));
                        break;
                    }
                    unsubscribe();
                  },
                );
              });
            }
            throw new Error(
              `No frontend action implemented for tool ${toolDetails.key}`,
            );
          },
        },
      },
    };

    if (context.bridgeConditions?.isAGWToNonABSChain) {
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
