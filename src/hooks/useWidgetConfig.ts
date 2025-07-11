import envConfig from '@/config/env-config';
import getApiUrl from '@/utils/getApiUrl';
import { useWalletMenu } from '@lifi/wallet-management';
import type { WidgetTheme } from '@lifi/widget';
import { HiddenUI, type ChainId, type WidgetConfig } from '@lifi/widget';
import { deepmerge } from '@mui/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { themeAllowChains } from 'src/components/Widgets';
import { tokens } from 'src/config/tokens';
import { publicRPCList } from 'src/const/rpcList';
import { TabsMap } from 'src/const/tabsMap';
import { ThemesMap } from 'src/const/themesMap';
import { useActiveTabStore } from 'src/stores/activeTab';
import { useThemeStore } from 'src/stores/theme';
import { useWidgetCacheStore } from 'src/stores/widgetCache';
import type { LanguageKey } from 'src/types/i18n';
import type { StarterVariantType } from 'src/types/internal';
import { useConfig } from 'wagmi';
import { useMemelist } from './useMemelist';
import { useUserTracking } from './userTracking';

interface UseWidgetConfigProps {
  fromChain?: ChainId;
  toChain?: ChainId;
  fromToken?: string;
  toToken?: string;
  fromAmount?: string;
  starterVariant?: StarterVariantType;
  allowChains?: number[];
  widgetIntegrator?: string;
  customWidgetTheme?: WidgetTheme;
}

export const useWidgetConfig = ({
  fromChain,
  toChain,
  fromToken,
  toToken,
  fromAmount,
  starterVariant,
  allowChains,
  widgetIntegrator,
  customWidgetTheme,
}: UseWidgetConfigProps) => {
  const widgetCache = useWidgetCacheStore((state) => state);
  const [widgetTheme, configTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);
  const { activeTab } = useActiveTabStore();
  const wagmiConfig = useConfig();
  const { trackEvent } = useUserTracking();
  const { i18n } = useTranslation();
  const isGasVariant = activeTab === TabsMap.Refuel.index;
  const integratorStringByType = useMemo(() => {
    if (configTheme?.integrator) {
      return configTheme.integrator;
    }
    if (widgetIntegrator) {
      return widgetIntegrator;
    }
    // all the trafic from mobile (including "/gas")
    // if (!isDesktop) {
    //   return envConfig.NEXT_PUBLIC_INTEGRATOR_MOBILE;
    // }
    // all the trafic from web on "/gas"
    if (isGasVariant) {
      return envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL;
    }

    return envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR;
  }, [configTheme.integrator, widgetIntegrator, isGasVariant]) as string;
  const { openWalletMenu } = useWalletMenu();
  const partnerName = configTheme?.uid ?? 'default';
  const { tokens: memeListTokens } = useMemelist({
    enabled: partnerName === ThemesMap.Memecoins,
  });
  const allowedChainsByVariant = useMemo(
    () => (partnerName === ThemesMap.Memecoins ? themeAllowChains : []),
    [starterVariant, partnerName],
  );

  // load environment config
  const config: WidgetConfig = useMemo((): WidgetConfig => {
    let rpcUrls = {};
    try {
      rpcUrls = {
        ...JSON.parse(envConfig.NEXT_PUBLIC_CUSTOM_RPCS),
        ...publicRPCList,
      };
    } catch (e) {
      if (envConfig.DEV) {
        console.warn('Parsing custom rpcs failed', e);
      }
    }

    //todo: to clean this logic to explain better the split between parameters and Strapi pre-filled information
    const formParameters: Record<string, number | string | undefined> = {
      fromChain:
        configTheme.fromChain ?? (fromChain || widgetCache.fromChainId),
      fromToken: configTheme.fromToken ?? (fromToken || widgetCache.fromToken),
      toChain: configTheme.toChain ?? toChain,
      toToken: configTheme.toToken ?? toToken,
      fromAmount: fromAmount,
    };

    for (const key in formParameters) {
      if (!formParameters[key]) {
        delete formParameters[key];
      }
    }

    if (memeListTokens) {
      tokens.allow!.concat(memeListTokens);
    }

    const mergedWidgetTheme = deepmerge(
      widgetTheme.config.theme,
      customWidgetTheme,
    );

    return {
      ...formParameters,
      variant:
        configTheme.variant ??
        (starterVariant === 'refuel' ? 'compact' : 'wide'),
      subvariant:
        (starterVariant !== 'buy' &&
          !(partnerName === ThemesMap.Memecoins) &&
          starterVariant) ||
        'default',
      walletConfig: {
        onConnect: openWalletMenu,
      },
      chains: configTheme.chains ?? {
        allow: allowChains || allowedChainsByVariant,
      },
      bridges: {
        allow: configTheme?.allowedBridges,
        deny: ['allbridge', 'hop', 'celerim', 'squid'],
      },
      exchanges: {
        allow: configTheme?.allowedExchanges,
        deny: ['bepop', 'paraswap', '0x'],
      },
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],
      appearance: widgetTheme.config.appearance,
      theme: mergedWidgetTheme,
      keyPrefix: `jumper-${starterVariant}`,
      apiKey: envConfig.NEXT_PUBLIC_LIFI_API_KEY,
      sdkConfig: {
        apiUrl: getApiUrl(),
        rpcUrls,
        routeOptions: {
          maxPriceImpact: 0.4,
        },
      },
      buildUrl: true,
      integrator: integratorStringByType,
      tokens: tokens,
    };
  }, [
    configTheme.fromChain,
    configTheme.fromToken,
    configTheme.toChain,
    configTheme.toToken,
    configTheme.variant,
    configTheme.chains,
    configTheme?.allowedBridges,
    configTheme?.allowedExchanges,
    fromChain,
    widgetCache.fromChainId,
    widgetCache.fromToken,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    memeListTokens,
    widgetTheme.config.theme,
    widgetTheme.config.appearance,
    customWidgetTheme,
    starterVariant,
    partnerName,
    openWalletMenu,
    allowChains,
    allowedChainsByVariant,
    i18n.language,
    i18n.languages,
    integratorStringByType,
  ]);

  return config;
};
