import type { Resource, i18n } from 'i18next';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import i18nConfig from '../../i18nconfig';
import {
  currencyFormatter,
  decimalFormatter,
  percentFormatter,
} from '@/utils/formatNumbers';
import { dateFormatter } from 'src/utils/formatDate';

// TODO: use https://nextjs.org/docs/app/building-your-application/routing/internationalization#localization
export default async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource,
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../i18n/translations/${language}/${namespace}.json`),
      ),
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    react: { useSuspense: false },
    supportedLngs: i18nConfig.locales,
    returnEmptyString: false,
    partialBundledLanguages: true,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  i18nInstance.services.formatter?.addCached('percentExt', percentFormatter);
  i18nInstance.services.formatter?.addCached('decimalExt', decimalFormatter);
  i18nInstance.services.formatter?.addCached('currencyExt', currencyFormatter);
  i18nInstance.services.formatter?.addCached('dateExt', dateFormatter);

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}
