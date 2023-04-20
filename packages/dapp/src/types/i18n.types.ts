import type * as languages from '../i18n';
// i18n: start -->
export type PartialResource<T> = T extends object
  ? {
      [P in keyof T]?: PartialResource<T[P]>;
    }
  : T;

export type LanguageKey = keyof typeof languages;

export type LanguageResources =
  | {
      [language in LanguageKey]?: PartialResource<typeof languages.en>;
    }
  | {
      [language: string]: PartialResource<typeof languages.en>;
    };

export type LanguageTranslationResource = {
  [namespace in 'translation']: PartialResource<typeof languages.en>;
};

export type LanguageTranslationResources = {
  [language: string]: LanguageTranslationResource;
};
// <-- i18n end
