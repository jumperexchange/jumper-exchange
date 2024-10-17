export const cookiesExpires = 3;

export const localStorageKey = {
  activeTab: 'activeTab',
  themeMode: 'themeMode',
  clientWallets: 'clientWallets',
  disabledFeatureCards: 'disabledFeatureCards',
};

interface DefaultSettingsType {
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
}

export const defaultSettings: DefaultSettingsType = {
  clientWallets: [],
  disabledFeatureCards: [],
  welcomeScreenClosed: false,
};

interface DefaultFpType {
  fp: string;
}

export const DEFAULT_FP = 'unknown';
export const defaultFp: DefaultFpType = {
  fp: DEFAULT_FP,
};
