import 'i18next';
import type language from './en/language.json';
import type translation from './en/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    language: typeof language;
    translation: typeof translation;
  }
}
