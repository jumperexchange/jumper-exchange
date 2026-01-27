import type { EarnCardVariant } from '@/components/Cards/EarnCard/EarnCard.types';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export type WalletConnected = string;

export interface SettingsProps {
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
  portfolioWelcomeScreenClosed: Record<string, boolean>;
  earnCardVariant: EarnCardVariant;
}

export interface SettingsActions {
  // Installed Wallets
  setClientWallets: (wallet: string) => void;

  // Disable Feature Cards
  setDisabledFeatureCard: (id: string) => void;

  // Reset
  setDefaultSettings: VoidFunction;

  // Welcome Screen
  setWelcomeScreenClosed: (shown: boolean) => void;

  // Portfolio Welcome Screen
  setPortfolioWelcomeScreenClosed: (
    address: string | undefined,
    shown: boolean,
  ) => void;

  // Earn Card Variant
  setEarnCardVariant: (variant: EarnCardVariant) => void;
}

export type SettingsState = SettingsActions & SettingsProps;

export type SettingsStore = UseBoundStoreWithEqualityFn<
  StoreApi<SettingsState>
>;
