import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as supportedLocales from '../messages';
import type { LanguageResources } from './types';
import { deepMerge, removeEmpty } from './utils';

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  [locale: string]: Translation;
}

export const locales = (
  Object.keys(supportedLocales as LanguageResources) as string[]
).map((language: string) => {
  return language;
});

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }
  const languageKeys = (await import(`../messages/${locale}/language.json`))
    .default;
  if (locale === 'en') {
    return {
      messages: {
        ...(await import(`../messages/en/translation.json`)).default,
        ...languageKeys,
      },
    };
  } else {
    const enTranslation = (await import(`../messages/en/translation.json`))
      .default;
    const translation = (
      await import(`../messages/${locale}/translation.json`).then((value) =>
        removeEmpty(value),
      )
    ).default;

    const merge = deepMerge(enTranslation, { ...translation, ...languageKeys });
    console.log('MERGE', merge);
    return {
      messages: merge,
    };
  }
});
