import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from './useUserTracking';
import type { JumperEventData } from '../useJumperTracking';

export const useEarnTracking = () => {
  const { trackEvent } = useUserTracking();

  return {
    trackEarnPageOverviewEvent: (slug?: string) => {
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
    trackEarnDepositClickEvent: (slug?: string) => {
      trackEvent({
        category: TrackingCategory.Earn,
        action: TrackingAction.ClickEarnDepositButton,
        label: 'click-earn-deposit-button',
        data: {
          [TrackingEventParameter.EarnOpportunitySlug]: slug || '',
        },
      });
    },
    trackEarnWithdrawClickEvent: (slug?: string) => {
      trackEvent({
        category: TrackingCategory.Earn,
        action: TrackingAction.ClickEarnWithdrawButton,
        label: 'click-earn-withdraw-button',
        data: {
          [TrackingEventParameter.EarnOpportunitySlug]: slug || '',
        },
      });
    },
  };
};
