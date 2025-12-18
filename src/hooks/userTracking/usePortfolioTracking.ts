import { parseEarnPortfolioDataToTrackingData } from '@/utils/tracking/portfolio';
import { useUserTracking } from './useUserTracking';
import { TrackingCategory, TrackingAction } from '@/const/trackingKeys';
import type { DefiPosition } from '@/types/jumper-backend';
import type { MinimalToken } from '@/types/tokens';

export const usePortfolioTracking = () => {
  const { trackEvent } = useUserTracking();

  return {
    trackPortfolioPageOverviewEvent: (
      addresses: string[],
      tokens: MinimalToken[],
      defiPositionGroups: DefiPosition[][],
    ) => {
      const trackingData = parseEarnPortfolioDataToTrackingData(
        addresses,
        tokens,
        defiPositionGroups,
      );
      trackEvent({
        category: TrackingCategory.Portfolio,
        action: TrackingAction.PortfolioPageOverview,
        label: 'portfolio_page_overview',
        data: trackingData,
      });
    },
  };
};
