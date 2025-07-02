import {
  ChainType,
  HiddenUI,
  RequiredUI,
  ToAddress,
  WidgetConfig,
  WidgetSubvariant,
} from '@lifi/widget';
import { useMemo } from 'react';
import { useMissionStore } from 'src/stores/mission';
import { useThemeStore } from 'src/stores/theme';
import { useWalletMenu } from '@lifi/wallet-management';
import { publicRPCList } from 'src/const/rpcList';
import getApiUrl from 'src/utils/getApiUrl';
import { TaskType } from 'src/types/loyaltyPass';

export const useBaseWidgetConfig = () => {
  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const { openWalletMenu } = useWalletMenu();

  const baseConfig = useMemo(() => {
    return {
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
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
          maxWidth: 'unset',
          borderRadius: 24,
        },
        header: {
          // @Note this needs a workaround to be able to show title on multiple lines
          whiteSpace: 'break-spaces !important',
        },
      },
    } as WidgetConfig;
  }, [widgetTheme.config, openWalletMenu]);

  return baseConfig;
};

export const useLanguageResourcesWidgetConfig = (overrideHeader?: string) => {
  const {
    currentActiveTaskType,
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
  } = useMissionStore();

  const config: Partial<WidgetConfig> = useMemo(() => {
    let sourceDestinationTemplate = '';

    if (destinationToken?.tokenSymbol && destinationChain?.chainKey) {
      sourceDestinationTemplate = `to ${destinationToken?.tokenSymbol} on ${destinationChain?.chainKey}`;
    } else if (sourceToken?.tokenSymbol && sourceChain?.chainKey) {
      sourceDestinationTemplate = `from ${sourceToken?.tokenSymbol} on ${sourceChain?.chainKey}`;
    } else if (sourceToken?.tokenSymbol && destinationToken?.tokenSymbol) {
      sourceDestinationTemplate = `from ${sourceToken?.tokenSymbol} to ${destinationToken?.tokenSymbol}`;
    } else if (sourceToken?.tokenSymbol) {
      sourceDestinationTemplate = `from ${sourceToken?.tokenSymbol}`;
    } else if (destinationToken?.tokenSymbol) {
      sourceDestinationTemplate = `to ${destinationToken?.tokenSymbol}`;
    } else if (sourceChain?.chainKey) {
      sourceDestinationTemplate = `from ${sourceChain?.chainKey} chain`;
    } else if (destinationChain?.chainKey) {
      sourceDestinationTemplate = `to ${destinationChain?.chainKey} chain`;
    }

    const translationTemplate =
      overrideHeader ??
      `${currentActiveTaskType !== TaskType.Zap ? currentActiveTaskType : 'Deposit'} ${sourceDestinationTemplate}`;

    return {
      languageResources: {
        en: {
          header: {
            checkout: translationTemplate,
            exchange: translationTemplate,
            deposit: translationTemplate,
            swap: translationTemplate,
          },
        },
      },
    };
  }, [
    currentActiveTaskType,
    destinationChain?.chainKey,
    sourceChain?.chainKey,
    destinationToken?.tokenSymbol,
    sourceToken?.tokenSymbol,
  ]);

  return config;
};

export const useSubVariantWidgetConfig = () => {
  const { currentActiveTaskType } = useMissionStore();

  const config: Partial<WidgetConfig> = useMemo(() => {
    const partialConfig: Partial<WidgetConfig> = {
      subvariant: 'default' as WidgetSubvariant,
      subvariantOptions: undefined,
    };

    if (
      currentActiveTaskType === TaskType.Zap ||
      currentActiveTaskType === TaskType.Deposit
    ) {
      partialConfig.subvariant = 'custom' as WidgetSubvariant;
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
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
    // missionChainIds,
  } = useMissionStore();

  const config: Partial<WidgetConfig> = useMemo(() => {
    return {
      fromChain: sourceChain?.chainId
        ? Number(sourceChain?.chainId)
        : undefined,
      fromToken: sourceToken?.tokenAddress,
      toChain: destinationChain?.chainId
        ? Number(destinationChain?.chainId)
        : undefined,
      toToken: destinationToken?.tokenAddress,
      toAddress: toAddress
        ? {
            address: toAddress.walletAddress,
            chainType: (toAddress.chainType as ChainType) ?? ChainType.EVM,
          }
        : undefined,
      fromAmount,
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
    destinationChain?.chainId,
    destinationToken?.tokenAddress,
    sourceChain?.chainId,
    sourceToken?.tokenAddress,
    fromAmount,
    toAddress?.walletAddress,
    // missionChainIds,
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
