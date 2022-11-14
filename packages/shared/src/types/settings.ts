// ----------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';
export enum DappLanguagesSupported {
  // Todo: Check Typing, does it fit here?
  // It´s meant for dapp, but is placed in shared folder, can I pass those types?
  en = 'en',
  de = 'de',
}

export type DappLanguageSupported = 'de' | 'en';

export type SettingsValueProps = {
  themeMode: ThemeMode;
  languageMode: DappLanguagesSupported; // Todo: Same here, languages supported depends on app
};

export type SettingsContextProps = {
  themeMode?: ThemeMode;
  languageMode?: DappLanguagesSupported; // Todo: Same here, languages supported depends on app

  // Mode
  onToggleMode: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // Language
  onChangeLanguage: (language: string) => void; // Todo: Check Typing, language: DappLanguagesSupported

  // Direction
  onChangeDirectionByLang: (lang: string) => void;

  // Reset
  onResetSetting: VoidFunction;
};
