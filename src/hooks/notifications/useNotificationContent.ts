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
  const fallback: NotificationContent = {
    title: notification.title,
    body: notification.body,
    ctaLabel: notification.ctaLabel,
  };

  const ruleId = notification.sourceRuleId;
  const titleKey = `notifications.${ruleId}.title`;
  const bodyKey = `notifications.${ruleId}.body`;
  if (!ruleId || !ctx.i18n.exists(titleKey) || !ctx.i18n.exists(bodyKey)) {
    return fallback;
  }

  // Dynamic union keys carrying interpolation options can't be narrowed by the
  // typed-resources `t()`; the keys are validated above with `i18n.exists`.
  const translate = ctx.t as unknown as (
    key: string,
    options?: Record<string, unknown>,
  ) => string;
  const params = notification.metadata ?? {};
  const ctaKey = `notifications.${ruleId}.cta`;

  return {
    title: translate(titleKey, params),
    body: translate(bodyKey, params),
    ctaLabel: ctx.i18n.exists(ctaKey)
      ? translate(ctaKey, params)
      : notification.ctaLabel,
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
