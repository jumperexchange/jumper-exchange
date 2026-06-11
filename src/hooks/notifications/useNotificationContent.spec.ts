import type { i18n as I18nInstance, TFunction } from 'i18next';
import { beforeAll, describe, expect, it } from 'vitest';
import initTranslations from '@/app/i18n';
import type { Notification } from '@/types/notifications';
import { NotificationCategory } from '@/types/notifications';
import { resolveNotificationContent } from './useNotificationContent';

const makeNotification = (
  overrides: Partial<Notification> = {},
): Notification => ({
  id: '1',
  title: 'STORED TITLE',
  body: 'STORED BODY',
  category: NotificationCategory.Earn,
  ctaLabel: 'STORED CTA',
  ctaUrl: '/earn',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  expiresAt: null,
  isGlobal: false,
  metadata: {},
  priority: 5,
  sourceRuleId: '',
  status: 'pending',
  userAddress: '0xabc',
  ...overrides,
});

describe('resolveNotificationContent', () => {
  let t: TFunction;
  let i18n: I18nInstance;

  beforeAll(async () => {
    const init = await initTranslations('en', ['translation', 'language']);
    t = init.t;
    i18n = init.i18n;
  });

  const resolve = (notification: Notification) =>
    resolveNotificationContent(notification, { t, i18n });

  it('translates idleAssets, formatting raw APY/USD and resolving the chain', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'idleAssets',
        metadata: {
          apy: '0.0441',
          symbol: 'USDC',
          amountUsd: '5000',
          chainId: 137,
          opportunityName: 'Aave USDC',
        },
      }),
    );

    expect(content.title).toBe('Earn 4.41% APY on your idle USDC');
    expect(content.body).toBe(
      'You have $5,000.00 USDC on Polygon sitting idle. Deposit into Aave USDC to earn 4.41% APY.',
    );
    expect(content.ctaLabel).toBe('Start Earning');
  });

  it('translates apyDrop, formatting both fractional APYs as percentages', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'apyDrop',
        metadata: {
          opportunityName: 'Aave USDC',
          previousApy: '0.05',
          currentApy: '0.03',
        },
      }),
    );

    expect(content.title).toBe('Aave USDC: APY dropped');
    expect(content.body).toBe(
      'The APY for Aave USDC dropped from 5.00% to 3.00%. Consider reviewing your position on Jumper Earn.',
    );
  });

  it('translates userLevelUp with raw level numbers', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'userLevelUp',
        metadata: { oldLevel: 2, newLevel: 3 },
      }),
    );

    expect(content.title).toBe('You reached Level 3!');
    expect(content.body).toBe(
      'Your Jumper Pass leveled up from Level 2 to Level 3. Keep earning XP to unlock more.',
    );
  });

  it('translates perkLevelUp (single) with the perk name and singular copy', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'perkLevelUp',
        ctaLabel: 'STORED CTA',
        metadata: {
          oldLevel: 4,
          newLevel: 5,
          count: 1,
          perks: [
            { name: 'Fee discount', slug: 'fee-discount', unlockLevel: 5 },
          ],
        },
      }),
    );

    expect(content.title).toBe('Perk unlocked: Fee discount');
    expect(content.body).toBe(
      'Reaching Level 5 unlocked Fee discount. Check it out in your Jumper Pass.',
    );
    expect(content.ctaLabel).toBe('View Jumper Pass');
  });

  it('translates perkLevelUp (multiple) with a joined name list and plural copy', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'perkLevelUp',
        metadata: {
          oldLevel: 4,
          newLevel: 7,
          count: 2,
          perks: [
            { name: 'Fee discount', slug: 'fee-discount', unlockLevel: 5 },
            {
              name: 'Priority support',
              slug: 'priority-support',
              unlockLevel: 7,
            },
          ],
        },
      }),
    );

    expect(content.title).toBe('You unlocked 2 new perks!');
    expect(content.body).toBe(
      'Reaching Level 7 unlocked Fee discount, Priority support. Check them out in your Jumper Pass.',
    );
  });

  it('falls back to stored copy for perkLevelUp when count is absent', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'perkLevelUp',
        metadata: {
          newLevel: 5,
          perks: [
            { name: 'Fee discount', slug: 'fee-discount', unlockLevel: 5 },
          ],
        },
      }),
    );

    expect(content).toEqual({
      title: 'STORED TITLE',
      body: 'STORED BODY',
      ctaLabel: 'STORED CTA',
    });
  });

  it('derives the verb (nesting) and joins chain names for newToolLaunch', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'newToolLaunch',
        metadata: { toolName: 'Acme', toolType: 'BRIDGE', chainIds: [137, 10] },
      }),
    );

    expect(content.body).toBe(
      'Acme is now live on Jumper. You recently bridged on Polygon, OP Mainnet — try it now.',
    );
  });

  it('falls back to stored copy for an unknown rule id', () => {
    const content = resolve(
      makeNotification({
        sourceRuleId: 'mysteryRule',
        metadata: { foo: 'bar' },
      }),
    );

    expect(content).toEqual({
      title: 'STORED TITLE',
      body: 'STORED BODY',
      ctaLabel: 'STORED CTA',
    });
  });
});
