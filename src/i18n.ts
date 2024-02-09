import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as supportedLocales from '../messages';
import type { LanguageResources } from './types';
import { deepMerge, removeEmpty } from './utils';

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
  if (locale === 'en') {
    return {
      messages: (await import(`../messages/en/translation.json`)).default,
    };
  } else {
    const enTranslation = (await import(`../messages/en/translation.json`))
      .default;
    const translation = (
      await import(`../messages/${locale}/translation.json`).then((value) =>
        removeEmpty(value),
      )
    ).default;
    const merge = deepMerge(enTranslation, translation);

    return {
      messages: merge,
    };
  }
});
