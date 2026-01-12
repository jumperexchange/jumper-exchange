import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from './useUserTracking';
import type { JumperEventData } from '../useJumperTracking';
import { useCallback } from 'react';

export const useMissionTracking = () => {
  const { trackEvent } = useUserTracking();

  const trackMissionPageOverviewEvent = useCallback(
    (slug?: string) => {
      const data: JumperEventData = slug
        ? {
            [TrackingEventParameter.MissionSlug]: slug,
          }
        : {};
      trackEvent({
        category: TrackingCategory.Quests,
        action: TrackingAction.MissionPageOverview,
        label: 'mission_page_overview',
        data,
      });
    },
    [trackEvent],
  );

  return {
    trackMissionPageOverviewEvent,
  };
};
