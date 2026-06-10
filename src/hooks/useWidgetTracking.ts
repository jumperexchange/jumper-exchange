import { useWidgetEvents } from '@lifi/widget';
import { useEffect, useMemo, useRef } from 'react';
import { useUrlParams } from '@/hooks/useUrlParams';
import { composeWidgetTrackingHandlers } from 'src/components/Widgets/tracking/composeWidgetTrackingHandlers';
import type { WidgetTrackingUrlParams } from 'src/components/Widgets/tracking/WidgetTrackingSession';
import { createWidgetTrackingSession } from 'src/components/Widgets/tracking/WidgetTrackingSession';
import type { WidgetEventTrackerConfig } from 'src/components/Widgets/tracking/types';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
} from 'src/components/Widgets/WidgetEventsManager';
import { useUserTracking } from 'src/hooks/userTracking';
import { useTokens } from 'src/hooks/useTokens';

export const useWidgetTracking = (trackerConfig: WidgetEventTrackerConfig) => {
  const tracking = useUserTracking();
  const { getToken } = useTokens();
  const urlParams = useUrlParams();

  const urlParamsRef = useRef<WidgetTrackingUrlParams>(urlParams);
  urlParamsRef.current = urlParams;

  const sessionRef = useRef<ReturnType<
    typeof createWidgetTrackingSession
  > | null>(null);
  if (!sessionRef.current) {
    sessionRef.current = createWidgetTrackingSession(urlParamsRef);
  }
  const session = sessionRef.current;

  const eventHandlers = useMemo(
    () =>
      composeWidgetTrackingHandlers(trackerConfig, {
        tracking,
        session,
        getToken,
      }),
    [trackerConfig, tracking, getToken, session],
  );

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    setupWidgetEvents(eventHandlers, widgetEvents);
    return () => {
      teardownWidgetEvents(eventHandlers, widgetEvents);
    };
  }, [eventHandlers, widgetEvents]);

  return session;
};
