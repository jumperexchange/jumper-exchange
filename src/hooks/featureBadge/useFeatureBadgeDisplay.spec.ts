// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import type { StrapiBadgeComponent } from '@/types/strapi';
import {
  type FeatureBadgeConfig,
  useFeatureBadgeDisplay,
} from './useFeatureBadgeDisplay';

const NOW = new Date('2026-01-15T12:00:00.000Z');

const liveBadge: StrapiBadgeComponent = {
  Label: 'Live',
  Variant: BadgeVariant.New,
  Size: BadgeSize.MD,
};

const soonBadge: StrapiBadgeComponent = {
  Label: 'Soon',
  Variant: BadgeVariant.Warning,
  Size: BadgeSize.SM,
};

const render = (config: Partial<FeatureBadgeConfig>) =>
  renderHook(() => useFeatureBadgeDisplay({ liveBadge, ...config })).result
    .current;

describe('useFeatureBadgeDisplay', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('hides when Enabled is false, regardless of timeline', () => {
    expect(render({ enabled: false }).isVisible).toBe(false);
  });

  it('shows the SoonBadge before LaunchAt', () => {
    const result = render({
      launchAt: '2026-02-01T00:00:00.000Z',
      soonBadge,
    });
    expect(result.isVisible).toBe(true);
    expect(result.label).toBe('Soon');
    expect(result.variant).toBe(BadgeVariant.Warning);
  });

  it('hides before LaunchAt when no SoonBadge is set', () => {
    expect(render({ launchAt: '2026-02-01T00:00:00.000Z' }).isVisible).toBe(
      false,
    );
  });

  it('shows the LiveBadge after LaunchAt', () => {
    const result = render({ launchAt: '2026-01-01T00:00:00.000Z', soonBadge });
    expect(result.isVisible).toBe(true);
    expect(result.label).toBe('Live');
  });

  it('shows the LiveBadge immediately when LaunchAt is empty', () => {
    expect(render({ expiryMode: 'until_date' }).isVisible).toBe(true);
  });

  it('until_date: hides once ExpiresAt has passed', () => {
    expect(
      render({
        expiryMode: 'until_date',
        expiresAt: '2026-01-10T00:00:00.000Z',
      }).isVisible,
    ).toBe(false);
  });

  it('until_date: shows while ExpiresAt is in the future', () => {
    expect(
      render({
        expiryMode: 'until_date',
        expiresAt: '2026-02-10T00:00:00.000Z',
      }).isVisible,
    ).toBe(true);
  });

  it('days_after_launch: shows inside the window relative to LaunchAt', () => {
    expect(
      render({
        expiryMode: 'days_after_launch',
        launchAt: '2026-01-10T00:00:00.000Z',
        displayDaysAfterLaunch: 30,
      }).isVisible,
    ).toBe(true);
  });

  it('days_after_launch: hides past the window relative to LaunchAt', () => {
    expect(
      render({
        expiryMode: 'days_after_launch',
        launchAt: '2025-12-01T00:00:00.000Z',
        displayDaysAfterLaunch: 30,
      }).isVisible,
    ).toBe(false);
  });

  it('days_after_launch: falls back to referenceDate when LaunchAt is empty', () => {
    expect(
      render({
        expiryMode: 'days_after_launch',
        displayDaysAfterLaunch: 30,
        referenceDate: '2025-12-01T00:00:00.000Z',
      }).isVisible,
    ).toBe(false);
    expect(
      render({
        expiryMode: 'days_after_launch',
        displayDaysAfterLaunch: 30,
        referenceDate: '2026-01-10T00:00:00.000Z',
      }).isVisible,
    ).toBe(true);
  });

  it('falls back to New / SM for missing variant and size', () => {
    const result = render({ liveBadge: { Label: 'X' } });
    expect(result.variant).toBe(BadgeVariant.New);
    expect(result.size).toBe(BadgeSize.SM);
  });

  it('resolves an absolute Icon url', () => {
    const result = render({
      liveBadge: {
        Label: 'X',
        Icon: { url: 'https://cdn.example.com/icon.png' } as never,
      },
    });
    expect(result.iconUrl).toBe('https://cdn.example.com/icon.png');
  });

  it('uses defaultLabel when the badge Label is empty', () => {
    const result = render({
      liveBadge: { Label: '' as string } as StrapiBadgeComponent,
      defaultLabel: 'Recently added',
    });
    expect(result.label).toBe('Recently added');
  });
});
