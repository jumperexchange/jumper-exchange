import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { TaskType } from 'src/types/strapi';
import { ConfigContext } from '../types';
import { useTranslation } from 'react-i18next';
import { LanguageKey } from 'src/types/i18n';

type EnglishLanguageResource = NonNullable<
  WidgetConfig['languageResources']
>['en'];

export const useLanguageResources = (ctx: ConfigContext) => {
  const { i18n, t } = useTranslation();
  const {
    currentActiveTaskType,
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    overrideHeader,
    zapPoolName,
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
      `${currentActiveTaskType ?? TaskType.Deposit} ${sourceDestinationTemplate}`;

    const languageResourcesEN: EnglishLanguageResource = {
      header: {
        checkout: translationTemplate,
        exchange: translationTemplate,
        deposit: translationTemplate,
        swap: translationTemplate,
      },
    };

    if (zapPoolName) {
      languageResourcesEN.main = {
        sentToAddress: t('widget.zap.sentToAddressName', {
          name: zapPoolName,
        }),
        sendToAddress: t('widget.zap.sendToAddressName', {
          name: zapPoolName,
        }),
      };
    }

    return {
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      languageResources: {
        en: languageResourcesEN,
      },
    };
  }, [
    i18n,
    t,
    currentActiveTaskType,
    destinationChain?.chainKey,
    sourceChain?.chainKey,
    destinationToken?.tokenSymbol,
    sourceToken?.tokenSymbol,
    zapPoolName,
  ]);

  return config;
};
