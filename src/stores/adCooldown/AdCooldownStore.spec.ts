import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useAdCooldownStore,
  getCooldownKey,
  DEFAULT_AD_COOLDOWN_DURATION,
  MIN_AD_COOLDOWN_DURATION,
  NO_WALLET_COOLDOWN_KEY,
} from './AdCooldownStore';

let mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    mockStorage = {};
  },
  length: 0,
  key: () => null,
};

describe('AdCooldownStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    mockStorage = {};
    useAdCooldownStore.setState({
      adSession: {},
      cooldownDuration: DEFAULT_AD_COOLDOWN_DURATION,
      _hasHydrated: false,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getCooldownKey returns wallet address when provided', () => {
    expect(getCooldownKey('0xabc')).toBe('0xabc');
  });

  it('getCooldownKey returns NO_WALLET_COOLDOWN_KEY for empty string', () => {
    expect(getCooldownKey('')).toBe(NO_WALLET_COOLDOWN_KEY);
  });

  it('isInCooldown returns false when wallet has no session', () => {
    expect(useAdCooldownStore.getState().isInCooldown('0x123')).toBe(false);
  });

  it('isInCooldown returns true immediately after setShownCards', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-1', 'ad-2']);
    expect(useAdCooldownStore.getState().isInCooldown(wallet)).toBe(true);
  });

  it('isInCooldown returns false after cooldown period expires', () => {
    const wallet = '0xabc';
    vi.useFakeTimers();
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-1']);
    vi.advanceTimersByTime(DEFAULT_AD_COOLDOWN_DURATION + 1);
    expect(useAdCooldownStore.getState().isInCooldown(wallet)).toBe(false);
    vi.useRealTimers();
  });

  it('each wallet has an independent cooldown', () => {
    useAdCooldownStore.getState().setShownCards('0xaaa', ['ad-1']);
    expect(useAdCooldownStore.getState().isInCooldown('0xaaa')).toBe(true);
    expect(useAdCooldownStore.getState().isInCooldown('0xbbb')).toBe(false);
  });

  it('setShownCards stores session with timestamp and adIds under getCooldownKey', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-1', 'ad-2']);
    const entry =
      useAdCooldownStore.getState().adSession[getCooldownKey(wallet)];
    expect(entry).toBeDefined();
    expect(entry.timestamp).toBeGreaterThan(0);
    expect(entry.adIds).toEqual(['ad-1', 'ad-2']);
  });

  it('setShownCards overwrites previous session for same wallet', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-1']);
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-2', 'ad-3']);
    const entry =
      useAdCooldownStore.getState().adSession[getCooldownKey(wallet)];
    expect(entry.adIds).toEqual(['ad-2', 'ad-3']);
  });

  it('each wallet stores its session independently', () => {
    useAdCooldownStore.getState().setShownCards('0xaaa', ['ad-1']);
    useAdCooldownStore.getState().setShownCards('0xbbb', ['ad-2']);
    expect(
      useAdCooldownStore.getState().adSession[getCooldownKey('0xaaa')].adIds,
    ).toEqual(['ad-1']);
    expect(
      useAdCooldownStore.getState().adSession[getCooldownKey('0xbbb')].adIds,
    ).toEqual(['ad-2']);
  });

  it('isCardRegistered returns false when wallet has no session', () => {
    expect(
      useAdCooldownStore.getState().isCardRegistered('0x123', 'ad-1'),
    ).toBe(false);
  });

  it('isCardRegistered returns true for ads included in setShownCards', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-1', 'ad-2']);
    expect(useAdCooldownStore.getState().isCardRegistered(wallet, 'ad-1')).toBe(
      true,
    );
    expect(useAdCooldownStore.getState().isCardRegistered(wallet, 'ad-2')).toBe(
      true,
    );
  });

  it('isCardRegistered returns false for an ad not in session', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-1']);
    expect(
      useAdCooldownStore.getState().isCardRegistered(wallet, 'ad-99'),
    ).toBe(false);
  });

  it('isCardRegistered returns false for a different wallet even if ad matches', () => {
    useAdCooldownStore.getState().setShownCards('0xaaa', ['ad-1']);
    expect(
      useAdCooldownStore.getState().isCardRegistered('0xbbb', 'ad-1'),
    ).toBe(false);
  });

  it('clearCooldown removes the session for the wallet', () => {
    const wallet = '0xdef';
    useAdCooldownStore.getState().setShownCards(wallet, ['ad-1', 'ad-2']);
    useAdCooldownStore.getState().clearCooldown(wallet);
    expect(useAdCooldownStore.getState().isInCooldown(wallet)).toBe(false);
    expect(useAdCooldownStore.getState().isCardRegistered(wallet, 'ad-1')).toBe(
      false,
    );
    expect(useAdCooldownStore.getState().isCardRegistered(wallet, 'ad-2')).toBe(
      false,
    );
  });

  it('clearCooldown only affects the specified wallet', () => {
    useAdCooldownStore.getState().setShownCards('0xaaa', ['ad-1']);
    useAdCooldownStore.getState().setShownCards('0xbbb', ['ad-2']);
    useAdCooldownStore.getState().clearCooldown('0xaaa');
    expect(useAdCooldownStore.getState().isInCooldown('0xaaa')).toBe(false);
    expect(useAdCooldownStore.getState().isInCooldown('0xbbb')).toBe(true);
  });

  it('empty wallet address uses NO_WALLET_COOLDOWN_KEY', () => {
    useAdCooldownStore.getState().setShownCards('', ['ad-1']);
    expect(Object.keys(useAdCooldownStore.getState().adSession)).toContain(
      NO_WALLET_COOLDOWN_KEY,
    );
    expect(useAdCooldownStore.getState().isInCooldown('')).toBe(true);
    expect(useAdCooldownStore.getState().isCardRegistered('', 'ad-1')).toBe(
      true,
    );
  });

  it('clearCooldown with empty string clears no-wallet key', () => {
    useAdCooldownStore.getState().setShownCards('', ['ad-1']);
    useAdCooldownStore.getState().clearCooldown('');
    expect(
      useAdCooldownStore.getState().adSession[NO_WALLET_COOLDOWN_KEY],
    ).toBeUndefined();
  });

  it('clearCooldown with empty string does not affect other wallets', () => {
    useAdCooldownStore.getState().setShownCards('0xabc', ['ad-1']);
    useAdCooldownStore.getState().clearCooldown('');
    expect(Object.keys(useAdCooldownStore.getState().adSession)).toHaveLength(
      1,
    );
    expect(
      useAdCooldownStore.getState().adSession[getCooldownKey('0xabc')],
    ).toBeDefined();
  });

  it('setCooldownDuration updates the duration', () => {
    useAdCooldownStore.getState().setCooldownDuration(MIN_AD_COOLDOWN_DURATION);
    expect(useAdCooldownStore.getState().cooldownDuration).toBe(
      MIN_AD_COOLDOWN_DURATION,
    );
  });

  it('setCooldownDuration clamps to MIN_AD_COOLDOWN_DURATION', () => {
    useAdCooldownStore.getState().setCooldownDuration(1000);
    expect(useAdCooldownStore.getState().cooldownDuration).toBe(
      MIN_AD_COOLDOWN_DURATION,
    );
  });

  it('_hasHydrated starts as false', () => {
    expect(useAdCooldownStore.getState()._hasHydrated).toBe(false);
  });

  it('setHasHydrated updates _hasHydrated', () => {
    useAdCooldownStore.getState().setHasHydrated(true);
    expect(useAdCooldownStore.getState()._hasHydrated).toBe(true);
  });
});
