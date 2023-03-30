import type { Dispatch, SetStateAction } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import { createContainer } from 'react-tracked';
// config
// @type
import type {
  SettingsContextProps,
  SettingsValueProps,
} from '@transferto/shared/src/types/settings';
import { defaultSettings, localStorageKey } from '../config/config';

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // Wallet
  onWalletConnect: () => {},
  onWalletDisconnect: () => {},

  // Mode
  onChangeMode: () => {},

  // Tabs
  onChangeTab: () => {},

  // Language
  onChangeLanguage: () => {},

  // Reset
  onResetSetting: () => {},
};

const SettingsContext = createContext(initialState);

// ----------------------------------------------------------------------

const useSettingLocalStorage = (
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] => {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = useCallback(async () => {
    const activeWalletName = !!settings.activeWalletName
      ? settings.activeWalletName
      : 'none';
    localStorage.setItem(localStorageKey.activeWalletName, activeWalletName);
    const themeMode = !!settings.themeMode ? settings.themeMode : 'auto';
    localStorage.setItem(localStorageKey.themeMode, themeMode);
    localStorage.setItem(localStorageKey.languageMode, settings.languageMode);
  }, [settings]);

  useEffect(() => {
    onChangeSetting();
  }, [onChangeSetting, settings]);

  return [settings, setSettings];
};

export { SettingsContext };

export const useSettings = () => {
  const [settings] = useSettingLocalStorage(defaultSettings);

  return useState(settings);
};

export const { Provider: SettingsProvider, useTracked: useSharedSettings } =
  createContainer(useSettings);
