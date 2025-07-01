import {
  HiddenUI,
  RequiredUI,
  WidgetConfig,
  WidgetSubvariant,
} from '@lifi/widget';
import { useMemo } from 'react';
import { useMissionStore } from 'src/stores/mission';
import { useThemeStore } from 'src/stores/theme';
import { TaskType } from '../hooks';
import { useWalletMenu } from '@lifi/wallet-management';
import { publicRPCList } from 'src/const/rpcList';
import getApiUrl from 'src/utils/getApiUrl';

export const useBaseWidgetConfig = () => {
  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const { openWalletMenu } = useWalletMenu();

  //   if (configTheme?.integrator) {
  //     return configTheme.integrator;
  //   }

  const baseConfig = useMemo(() => {
    return {
      integrator: 'Test', // @Note this needs to be updated
      appearance: widgetTheme.config.appearance,
      keyPrefix: 'jumper-custom',
      apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
      variant: 'compact',
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
        HiddenUI.ToAddress, // @Note this should be dependant on the task type?
        HiddenUI.ReverseTokensButton,
        HiddenUI.History,
      ],
      requiredUI: [RequiredUI.ToAddress],
      walletConfig: {
        onConnect() {
          openWalletMenu();
        },
      },
      theme: {
        ...widgetTheme.config.theme,
        container: {
          maxHeight: 820,
          minWidth: 392,
          maxWidth: 'unset',
          borderRadius: 24,
        },
        header: {
          // @Note this needs a workaround to be able to show title on multiple lines
          whiteSpace: 'break-spaces !important',
        },
      },
      languageResources: {
        en: {
          header: {
            //@Note this needs to be updated based on template {{taskType}} to/from {{tokenSymbol}} on {{chainSymbol}}
            checkout: 'Bridge from ETH on ARB',
            exchange: `Deposit to Lisk using Jumper`,
            deposit: `Deposit to OP Pool on Velodrome`,
            swap: `Swap to OP on Lisk`,
          },
        },
      },
    } as WidgetConfig;
  }, [widgetTheme.config, openWalletMenu]);

  return baseConfig;
};

export const useSubVariantWidgetConfig = () => {
  const { currentActiveTaskType } = useMissionStore();

  const config = useMemo(() => {
    const partialConfig: Partial<WidgetConfig> = {
      subvariant: 'custom' as WidgetSubvariant,
    };

    if (
      currentActiveTaskType === TaskType.Zap ||
      currentActiveTaskType === TaskType.Deposit
    ) {
      partialConfig.subvariantOptions = {
        custom: 'deposit',
      };
    }

    return partialConfig;
  }, [currentActiveTaskType]);

  return config;
};

export const useBaseFormWidgetConfig = () => {
  const {
    destinationChainId,
    destinationTokenAddress,
    sourceChainId,
    sourceTokenAddress,
    missionChainIds,
  } = useMissionStore();

  const config: Partial<WidgetConfig> = useMemo(() => {
    return {
      fromChain: sourceChainId,
      fromToken: sourceTokenAddress,
      toChain: destinationChainId,
      toToken: destinationTokenAddress,
      // chains: {
      //   from: {
      //     allow: missionChainIds,
      //   },
      //   to: {
      //     allow: missionChainIds,
      //   },
      // },
    };
  }, [
    destinationChainId,
    destinationTokenAddress,
    sourceChainId,
    sourceTokenAddress,
    missionChainIds,
  ]);

  return config;
};

export const useBaseRPCWidgetConfig = () => {
  const config: Partial<WidgetConfig> = useMemo(() => {
    return {
      sdkConfig: {
        apiUrl: getApiUrl(),
        useRelayerRoutes: true,
        rpcUrls: {
          ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
          ...publicRPCList,
        },
        routeOptions: {
          maxPriceImpact: 0.4,
        },
      },
    };
  }, []);

  return config;
};
