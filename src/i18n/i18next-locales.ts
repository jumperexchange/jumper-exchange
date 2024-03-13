import type { LanguageResources } from 'src/types';
import * as supportedLocales from './locales_jumper';

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  [locale: string]: Translation;
}

export const locales = Object.keys(supportedLocales).map((locale: string) => {
  return locale as LanguageResources as string[];
});
