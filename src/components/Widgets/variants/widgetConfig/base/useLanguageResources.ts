import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { ConfigContext } from '../types';
import { useTranslation } from 'react-i18next';
import { LanguageKey } from 'src/types/i18n';

type EnglishLanguageResource = NonNullable<
  WidgetConfig['languageResources']
>['en'];

export const useLanguageResources = (ctx: ConfigContext) => {
  const { i18n, t } = useTranslation();

  const config: Partial<WidgetConfig> = useMemo(() => {
    const languageResourcesEN: EnglishLanguageResource = {
      warning: {
        message: {
          lowAddressActivity:
            "This address has low activity on this blockchain. Please verify above you're sending to the correct ADDRESS and network to prevent potential loss of funds. ABSTRACT WALLET WORKS ONLY ON ABSTRACT CHAIN, DO NOT SEND FUNDS TO ABSTRACT WALLET ON ANOTHER CHAIN.",
        },
      },
    };

    return {
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      languageResources: {
        en: languageResourcesEN,
      },
    };
  }, [i18n, t]);

  return config;
};
