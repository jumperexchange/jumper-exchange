import type { i18n as I18nInstance, TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import type { Notification } from '@/types/notifications';

/**
 * Rendered notification copy. Either the i18next-translated strings (when the
 * notification's `sourceRuleId` has a catalogue entry) or the backend-rendered
 * English fallback.
 */
export interface NotificationContent {
  title: string;
  body: string;
  ctaLabel: string;
}

/**
 * Translate a notification's copy via i18next keyed by `sourceRuleId`,
 * interpolating from `metadata`. Falls back to the stored
 * `title`/`body`/`ctaLabel` when the rule has no catalogue entry. Pure; the
 * hook below wires the i18n context.
 */
export function resolveNotificationContent(
  notification: Notification,
  ctx: { t: TFunction; i18n: I18nInstance },
): NotificationContent {
  const ruleId = notification.sourceRuleId;
  if (!ruleId) {
    return {
      title: notification.title,
      body: notification.body,
      ctaLabel: notification.ctaLabel,
    };
  }

  // Dynamic union keys carrying interpolation options can't be narrowed by the
  // typed-resources `t()`; the keys are validated below with `i18n.exists`.
  const translate = ctx.t as unknown as (
    key: string,
    options?: Record<string, unknown>,
  ) => string;
  const params = notification.metadata ?? {};

  const resolve = (key: string, fallbackValue: string): string =>
    ctx.i18n.exists(key) ? translate(key, params) : fallbackValue;

  return {
    title: resolve(`notifications.${ruleId}.title`, notification.title),
    body: resolve(`notifications.${ruleId}.body`, notification.body),
    ctaLabel: resolve(`notifications.${ruleId}.cta`, notification.ctaLabel),
  };
}

/**
 * Hook form of {@link resolveNotificationContent}, wired to the active i18n
 * instance.
 */
export function useNotificationContent(
  notification: Notification,
): NotificationContent {
  const { t, i18n } = useTranslation();
  return resolveNotificationContent(notification, { t, i18n });
}
