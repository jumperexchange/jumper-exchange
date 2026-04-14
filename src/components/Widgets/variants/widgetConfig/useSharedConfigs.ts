import { useMemo } from 'react';
import type { WidgetConfig } from '@lifi/widget';
import { ChainType } from '@lifi/sdk';
import envConfig from '@/config/env-config';
import { publicRPCList } from 'src/const/rpcList';
import getApiUrl from 'src/utils/getApiUrl';
import { useReferrerStore } from '@/stores/referrer/ReferrerStore';
import type {
  EnglishLanguageResource,
  FormData,
  HookDependencies,
  WidgetContext,
} from './types';
import { isMissionContext, isZapContext } from './types';
import { TaskType } from 'src/types/strapi';
import type { LanguageKey } from 'src/types/i18n';
import { AppPaths, getSiteUrl } from '@/const/urls';

/**
 * Shared base configuration that's common across all widget types.
 * Referrer is read from the store (captured once in layout via ReferrerCapture).
 */
export function useSharedBaseConfig(
  context: WidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  const referrer = useReferrerStore((state) => state.referrer);

  return useMemo(
    () => ({
      explorerUrls: {
        internal: [`${getSiteUrl()}${AppPaths.Scan}`],
      },
      integrator:
        context.integrator ??
        envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR ??
        'jumper.exchange',
      referrer,
      keyPrefix: context.keyPrefix,
      apiKey: envConfig.NEXT_PUBLIC_LIFI_API_KEY,
      defaultUI: {
        navigationHeaderTitleNoWrap: false,
        transactionDetailsExpanded: true,
      },
      walletConfig: {
        onConnect() {
          deps.wallet.openWalletMenu();
        },
      },
    }),
    [deps.wallet, context.integrator, context.keyPrefix, referrer],
  );
}

/**
 * Shared RPC configuration that's common across all widget types
 */
export function useSharedRPCConfig(): Partial<WidgetConfig> {
  return useMemo(
    () => ({
      sdkConfig: {
        apiUrl: getApiUrl(),
        rpcUrls: {
          ...JSON.parse(envConfig.NEXT_PUBLIC_CUSTOM_RPCS ?? '{}'),
          ...publicRPCList,
        },
        routeOptions: {
          maxPriceImpact: 0.4,
          jitoBundle: true,
        },
      },
    }),
    [],
  );
}

/**
 * Shared form configuration that handles form data mapping
 */
export function useSharedFormConfig(
  formData: FormData | undefined,
): Partial<WidgetConfig> {
  return useMemo(() => {
    const partialConfig: Partial<WidgetConfig> = {};

    if (formData?.sourceChain?.chainId) {
      partialConfig.fromChain = Number(formData.sourceChain.chainId);
    }

    if (formData?.sourceToken?.tokenAddress) {
      partialConfig.fromToken = formData.sourceToken.tokenAddress;
    }

    if (formData?.destinationChain?.chainId) {
      partialConfig.toChain = Number(formData.destinationChain.chainId);
    }

    if (formData?.destinationToken?.tokenAddress) {
      partialConfig.toToken = formData.destinationToken.tokenAddress;
    }

    if (formData?.toAddress) {
      partialConfig.toAddress = {
        address: formData.toAddress.walletAddress,
        chainType: (formData.toAddress.chainType as ChainType) ?? ChainType.EVM,
      };
    }

    if (formData?.fromAmount) {
      partialConfig.fromAmount = formData.fromAmount;
    }

    if (formData?.minFromAmountUSD) {
      partialConfig.minFromAmountUSD = formData.minFromAmountUSD;
    }

    return partialConfig;
  }, [
    formData?.sourceChain?.chainId,
    formData?.sourceToken?.tokenAddress,
    formData?.destinationChain?.chainId,
    formData?.destinationToken?.tokenAddress,
    formData?.fromAmount,
    formData?.toAddress?.walletAddress,
    formData?.toAddress?.chainType,
    formData?.minFromAmountUSD,
  ]);
}

/**
 * Shared language configuration
 */
export function useLanguageConfig(
  context: WidgetContext & {
    useMainWidget: boolean;
    useSwapBridgeTitle: boolean;
  },
  deps: HookDependencies,
): Partial<WidgetConfig> {
  return useMemo(() => {
    if (!isMissionContext(context)) {
      const languageResourcesEN: EnglishLanguageResource = {
        warning: {
          message: {
            lowAddressActivity:
              "This address has low activity on this blockchain. Please verify above you're sending to the correct ADDRESS and network to prevent potential loss of funds. ABSTRACT WALLET WORKS ONLY ON ABSTRACT CHAIN, DO NOT SEND FUNDS TO ABSTRACT WALLET ON ANOTHER CHAIN.",
          },
        },
      };

      languageResourcesEN.header = {
        exchange: context.useSwapBridgeTitle
          ? deps.translation.t('widget.swapBridge.title')
          : deps.translation.t('widget.exchange.title'),
      };

      return {
        languages: {
          default: deps.translation.i18n.language as LanguageKey,
          allow: deps.translation.i18n.languages as LanguageKey[],
        },
        languageResources: {
          en: languageResourcesEN,
        },
      };
    }

    // Mission widget language resources
    let sourceDestinationTemplate = '';

    const formData = context.formData ?? {};

    if (
      formData.destinationToken?.tokenSymbol &&
      formData.destinationChain?.chainKey
    ) {
      sourceDestinationTemplate = `to ${formData.destinationToken?.tokenSymbol} on ${formData.destinationChain?.chainKey}`;
    } else if (
      formData.sourceToken?.tokenSymbol &&
      formData.sourceChain?.chainKey
    ) {
      sourceDestinationTemplate = `from ${formData.sourceToken?.tokenSymbol} on ${formData.sourceChain?.chainKey}`;
    } else if (
      formData.sourceToken?.tokenSymbol &&
      formData.destinationToken?.tokenSymbol
    ) {
      sourceDestinationTemplate = `from ${formData.sourceToken?.tokenSymbol} to ${formData.destinationToken?.tokenSymbol}`;
    } else if (formData.sourceToken?.tokenSymbol) {
      sourceDestinationTemplate = `from ${formData.sourceToken?.tokenSymbol}`;
    } else if (formData.destinationToken?.tokenSymbol) {
      sourceDestinationTemplate = `to ${formData.destinationToken?.tokenSymbol}`;
    } else if (formData.sourceChain?.chainKey) {
      sourceDestinationTemplate = `from ${formData.sourceChain?.chainKey} chain`;
    } else if (formData.destinationChain?.chainKey) {
      sourceDestinationTemplate = `to ${formData.destinationChain?.chainKey} chain`;
    }

    const translationTemplate =
      context.overrideHeader ??
      `${!context.taskType || context.taskType === TaskType.Zap ? TaskType.Deposit : context.taskType} ${sourceDestinationTemplate}`;

    const languageResourcesEN: EnglishLanguageResource = {
      header: {
        checkout: translationTemplate,
        exchange: translationTemplate,
        deposit: translationTemplate,
        swap: translationTemplate,
      },
    };

    if (isZapContext(context) && context.zapPoolName) {
      languageResourcesEN.main = {
        sentToAddress: deps.translation.t('widget.zap.sentToAddressName', {
          name: context.zapPoolName,
        }),
        sendToAddress: deps.translation.t('widget.zap.sendToAddressName', {
          name: context.zapPoolName,
        }),
      };
    }

    if (isZapContext(context) && context.subTaskType === 'withdraw') {
      languageResourcesEN.button = {
        exchange: deps.translation.t('buttons.withdrawButtonLabel'),
        swap: deps.translation.t('buttons.withdrawButtonLabel'),
        deposit: deps.translation.t('buttons.withdrawButtonLabel'),
      };
    }

    return {
      languages: {
        default: deps.translation.i18n.language as LanguageKey,
        allow: deps.translation.i18n.languages as LanguageKey[],
      },
      languageResources: {
        en: languageResourcesEN,
      },
    };
  }, [context, deps.translation]);
}
