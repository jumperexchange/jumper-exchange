import type { LanguageKey, LanguageResources } from 'src/types';
import * as locales from './locales';

export const defaultLocale = 'en';
export const fallbackLng = 'en';
export const supportedLanguages = Object.keys(
  locales as LanguageResources,
) as LanguageKey[];

export const languages = supportedLanguages;

export const defaultNS = 'translation';
export const cookieName = 'i18next';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
