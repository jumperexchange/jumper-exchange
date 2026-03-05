import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdCooldownStore } from './AdCooldownStore';
import {
  DEFAULT_AD_COOLDOWN_DURATION,
  MIN_AD_COOLDOWN_DURATION,
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
      cooldownTimestamps: {},
      cooldownDuration: DEFAULT_AD_COOLDOWN_DURATION,
      _hasHydrated: false,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('isInCooldown returns false when wallet has no timestamp', () => {
    expect(useAdCooldownStore.getState().isInCooldown('0x123')).toBe(false);
  });

  it('isInCooldown returns true when within cooldown period', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-1');
    expect(useAdCooldownStore.getState().isInCooldown(wallet)).toBe(true);
  });

  it('isInCooldown returns false after cooldown period expires', () => {
    const wallet = '0xabc';
    vi.useFakeTimers();
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-1');
    vi.advanceTimersByTime(DEFAULT_AD_COOLDOWN_DURATION + 1);
    expect(useAdCooldownStore.getState().isInCooldown(wallet)).toBe(false);
    vi.useRealTimers();
  });

  it('setAdShown stores adId alongside timestamp', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-1');
    const entry = useAdCooldownStore.getState().cooldownTimestamps[wallet];
    expect(entry.adId).toBe('ad-1');
    expect(entry.timestamp).toBeGreaterThan(0);
  });

  // --- getActiveAdId ---

  it('getActiveAdId returns null when no ad has been shown', () => {
    expect(useAdCooldownStore.getState().getActiveAdId('0x123')).toBeNull();
  });

  it('getActiveAdId returns the adId set by setAdShown', () => {
    const wallet = '0xabc';
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-42');
    expect(useAdCooldownStore.getState().getActiveAdId(wallet)).toBe('ad-42');
  });

  it('getActiveAdId updates when a new ad is shown after cooldown expires', () => {
    const wallet = '0xabc';
    vi.useFakeTimers();
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-1');
    vi.advanceTimersByTime(DEFAULT_AD_COOLDOWN_DURATION + 1);
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-2');
    expect(useAdCooldownStore.getState().getActiveAdId(wallet)).toBe('ad-2');
    vi.useRealTimers();
  });

  it('clearCooldown removes timestamp for wallet', () => {
    const wallet = '0xdef';
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-1');
    expect(useAdCooldownStore.getState().isInCooldown(wallet)).toBe(true);
    useAdCooldownStore.getState().clearCooldown(wallet);
    expect(useAdCooldownStore.getState().isInCooldown(wallet)).toBe(false);
  });

  it('clearCooldown also clears the active adId', () => {
    const wallet = '0xdef';
    useAdCooldownStore.getState().setAdShown(wallet, 'ad-1');
    useAdCooldownStore.getState().clearCooldown(wallet);
    expect(useAdCooldownStore.getState().getActiveAdId(wallet)).toBeNull();
  });

  it('clearCooldown does nothing for empty wallet', () => {
    useAdCooldownStore.getState().setAdShown('0xabc', 'ad-1');
    useAdCooldownStore.getState().clearCooldown('');
    expect(
      Object.keys(useAdCooldownStore.getState().cooldownTimestamps),
    ).toHaveLength(1);
  });

  it('each wallet has independent cooldown', () => {
    const walletA = '0xaaa';
    const walletB = '0xbbb';
    useAdCooldownStore.getState().setAdShown(walletA, 'ad-1');
    expect(useAdCooldownStore.getState().isInCooldown(walletA)).toBe(true);
    expect(useAdCooldownStore.getState().isInCooldown(walletB)).toBe(false);
  });

  it('each wallet tracks its own active adId independently', () => {
    useAdCooldownStore.getState().setAdShown('0xaaa', 'ad-1');
    useAdCooldownStore.getState().setAdShown('0xbbb', 'ad-2');
    expect(useAdCooldownStore.getState().getActiveAdId('0xaaa')).toBe('ad-1');
    expect(useAdCooldownStore.getState().getActiveAdId('0xbbb')).toBe('ad-2');
  });

  it('setCooldownDuration updates duration', () => {
    useAdCooldownStore.getState().setCooldownDuration(MIN_AD_COOLDOWN_DURATION);
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
