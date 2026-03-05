export interface AdCooldownProps {
  cooldownTimestamps: Record<string, { timestamp: number; adId: string }>;
  cooldownDuration: number;
  _hasHydrated: boolean;
}

export interface AdCooldownActions {
  setHasHydrated: (value: boolean) => void;
  setAdShown: (walletAddress: string, adId: string) => void;
  isInCooldown: (walletAddress: string) => boolean;
  getActiveAdId: (walletAddress: string) => string | null;
  setCooldownDuration: (duration: number) => void;
  clearCooldown: (walletAddress: string) => void;
}

export type AdCooldownState = AdCooldownProps & AdCooldownActions;
