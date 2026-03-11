/** Per-wallet, per-ad cooldown entries. Multiple ads can be in cooldown at once. */
export type CooldownTimestamps = Record<
  string,
  Record<string, { timestamp: number }>
>;

export interface AdCooldownProps {
  cooldownTimestamps: CooldownTimestamps;
  cooldownDuration: number;
  _hasHydrated: boolean;
}

export interface AdCooldownActions {
  setHasHydrated: (value: boolean) => void;
  setAdShown: (walletAddress: string, adId: string) => void;
  /** True if this specific ad for this wallet/key is still within cooldown. */
  isInCooldown: (walletAddress: string, adId: string) => boolean;
  /** True if this ad is currently considered active (shown) for this wallet/key. */
  isAdActive: (walletAddress: string, adId: string) => boolean;
  setCooldownDuration: (duration: number) => void;
  /** Clear all ad cooldowns for this wallet/key. */
  clearCooldown: (walletAddress: string) => void;
  /** Clear cooldown for a specific ad for this wallet/key. */
  clearAdCooldown: (walletAddress: string, adId: string) => void;
}

export type AdCooldownState = AdCooldownProps & AdCooldownActions;
