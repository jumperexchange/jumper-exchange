import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from './useUserTracking';
import type { JumperEventData } from '../useJumperTracking';
import { useCallback } from 'react';

export const useEarnTracking = () => {
  const { trackEvent } = useUserTracking();

  const trackEarnPageOverviewEvent = useCallback(
    (slug?: string) => {
      const data: JumperEventData = slug
        ? {
            [TrackingEventParameter.EarnOpportunitySlug]: slug,
          }
        : {};
      trackEvent({
        category: TrackingCategory.Earn,
        action: TrackingAction.EarnPageOverview,
        label: 'earn_page_overview',
        data,
      });
    },
    [trackEvent],
  );

  const trackEarnDepositClickEvent = useCallback(
    (slug?: string) => {
      const data: JumperEventData = slug
        ? {
            [TrackingEventParameter.EarnOpportunitySlug]: slug,
          }
        : {};
      trackEvent({
        category: TrackingCategory.Earn,
        action: TrackingAction.ClickEarnDepositButton,
        label: 'click-earn-deposit-button',
        data,
      });
    },
    [trackEvent],
  );
  const trackEarnRequestRedeemClickEvent = useCallback(
    (slug?: string) => {
      const data: JumperEventData = slug
        ? {
            [TrackingEventParameter.EarnOpportunitySlug]: slug,
          }
        : {};
      trackEvent({
        category: TrackingCategory.Earn,
        action: TrackingAction.ClickEarnRequestRedeemButton,
        label: 'click-earn-request-redeem-button',
        data,
      });
    },
    [trackEvent],
  );

  const trackEarnWithdrawClickEvent = useCallback(
    (slug?: string) => {
      const data: JumperEventData = slug
        ? {
            [TrackingEventParameter.EarnOpportunitySlug]: slug,
          }
        : {};
      trackEvent({
        category: TrackingCategory.Earn,
        action: TrackingAction.ClickEarnWithdrawButton,
        label: 'click-earn-withdraw-button',
        data,
      });
    },
    [trackEvent],
  );

  return {
    trackEarnPageOverviewEvent,
    trackEarnDepositClickEvent,
    trackEarnRequestRedeemClickEvent,
    trackEarnWithdrawClickEvent,
  };
};
