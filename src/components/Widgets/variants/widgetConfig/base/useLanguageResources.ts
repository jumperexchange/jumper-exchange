import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { TaskType } from 'src/types/loyaltyPass';
import { ConfigContext } from '../types';

export const useLanguageResources = (ctx: ConfigContext) => {
  const {
    currentActiveTaskType,
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    overrideHeader,
  } = ctx;

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
      `${currentActiveTaskType ?? 'Deposit'} ${sourceDestinationTemplate}`;

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
