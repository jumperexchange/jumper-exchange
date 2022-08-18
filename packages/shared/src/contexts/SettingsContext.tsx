import Cookies from "js-cookie";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
// utils
// config
import {
  cookiesExpires,
  cookiesKey,
  defaultSettings,
} from "@transferto/shared/config";
// @type
import {
  SettingsContextProps,
  SettingsValueProps,
  ThemeMode,
} from "../components/settings/type";

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},

  // Direction
  onChangeDirectionByLang: () => {},

  // Reset
  onResetSetting: () => {},
};

const SettingsContext = createContext(initialState);

// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};

function SettingsProvider({
  children,
  defaultSettings,
}: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  const langStorage =
    typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : "";

  // Mode
  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === "light" ? "dark" : "light",
    });
  };

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    });
  };

  // Direction

  const onChangeDirectionByLang = (lang: string) => {
    setSettings({
      ...settings,
    });
  };

  // Reset

  const onResetSetting = () => {
    setSettings({
      themeMode: initialState.themeMode,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        // Mode
        onToggleMode,
        onChangeMode,

        onChangeDirectionByLang,

        // Reset
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

// ----------------------------------------------------------------------

function useSettingCookies(
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = () => {
    Cookies.set(cookiesKey.themeMode, settings.themeMode, {
      expires: cookiesExpires,
    });
  };

  useEffect(() => {
    onChangeSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return [settings, setSettings];
}
