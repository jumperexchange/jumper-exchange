interface DefaultSettingsType {
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
  portfolioWelcomeScreenClosed: boolean;
}

export const defaultSettings: DefaultSettingsType = {
  clientWallets: [],
  disabledFeatureCards: [],
  welcomeScreenClosed: false,
  portfolioWelcomeScreenClosed: false,
};

interface DefaultFpType {
  fp: string;
}

export const DEFAULT_FP = 'unknown';
export const defaultFp: DefaultFpType = {
  fp: DEFAULT_FP,
};
