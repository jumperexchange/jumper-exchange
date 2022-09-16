// ----------------------------------------------------------------------

export type ThemeMode = "light" | "dark";

export type SettingsValueProps = {
  themeMode: ThemeMode | undefined;
};

export type SettingsContextProps = {
  themeMode?: ThemeMode;

  // Mode
  onToggleMode: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // Direction
  onChangeDirectionByLang: (lang: string) => void;

  // Reset
  onResetSetting: VoidFunction;
};
