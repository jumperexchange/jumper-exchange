import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from './useUserTracking';

export const useEarnTracking = () => {
  const { trackEvent } = useUserTracking();

  return {
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
