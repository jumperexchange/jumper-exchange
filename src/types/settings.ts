import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export type WalletConnected = string;

export interface SettingsProps {
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
  portfolioWelcomeScreenClosed: Record<string, boolean>;
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
}

export type SettingsState = SettingsActions & SettingsProps;

export type SettingsStore = UseBoundStoreWithEqualityFn<
  StoreApi<SettingsState>
>;
