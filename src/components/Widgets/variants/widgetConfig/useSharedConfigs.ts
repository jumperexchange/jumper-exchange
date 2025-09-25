import { useMemo } from 'react';
import { WidgetConfig } from '@lifi/widget';
import { ChainType } from '@lifi/sdk';
import envConfig from '@/config/env-config';
import { publicRPCList } from 'src/const/rpcList';
import getApiUrl from 'src/utils/getApiUrl';
import {
  EnglishLanguageResource,
  FormData,
  HookDependencies,
  isMissionContext,
  isZapContext,
  WidgetContext,
} from './types';
import { TaskType } from 'src/types/strapi';
import { LanguageKey } from 'src/types/i18n';

/**
 * Shared base configuration that's common across all widget types
 */
export function useSharedBaseConfig(
  context: WidgetContext,
  deps: HookDependencies,
): Partial<WidgetConfig> {
  return useMemo(
    () => ({
      integrator: context.integrator ?? envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      keyPrefix: context.keyPrefix,
      apiKey: envConfig.NEXT_PUBLIC_LIFI_API_KEY,
      defaultUI: { navigationHeaderTitleNoWrap: false },
      walletConfig: {
        onConnect() {
          deps.wallet.openWalletMenu();
        },
      },
    }),
    [deps.wallet, context.integrator, context.keyPrefix],
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
          ...JSON.parse(envConfig.NEXT_PUBLIC_CUSTOM_RPCS),
          ...publicRPCList,
        },
        routeOptions: {
          maxPriceImpact: 0.4,
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
    formData?.minFromAmountUSD,
  ]);
}

/**
 * Shared language configuration
 */
export function useLanguageConfig(
  context: WidgetContext & { useMainWidget: boolean },
  deps: HookDependencies,
): Partial<WidgetConfig> {
  return useMemo(() => {
    if (!isMissionContext(context)) {
      return {
        languages: {
          default: deps.translation.i18n.language as LanguageKey,
          allow: deps.translation.i18n.languages as LanguageKey[],
        },
        languageResources: {
          en: {
            warning: {
              message: {
                lowAddressActivity:
                  "This address has low activity on this blockchain. Please verify above you're sending to the correct ADDRESS and network to prevent potential loss of funds. ABSTRACT WALLET WORKS ONLY ON ABSTRACT CHAIN, DO NOT SEND FUNDS TO ABSTRACT WALLET ON ANOTHER CHAIN.",
              },
            },
          },
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
