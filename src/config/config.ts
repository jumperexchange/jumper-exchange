import type { EarnCardVariant } from '@/components/Cards/EarnCard/EarnCard.types';

interface DefaultSettingsType {
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
  portfolioWelcomeScreenClosed: Record<string, boolean>;
  earnCardVariant: EarnCardVariant;
}

export const defaultSettings: DefaultSettingsType = {
  clientWallets: [],
  disabledFeatureCards: [],
  welcomeScreenClosed: false,
  portfolioWelcomeScreenClosed: {},
  earnCardVariant: 'compact',
};

interface DefaultFpType {
  fp: string;
}

export const DEFAULT_FP = 'unknown';
export const defaultFp: DefaultFpType = {
  fp: DEFAULT_FP,
};
