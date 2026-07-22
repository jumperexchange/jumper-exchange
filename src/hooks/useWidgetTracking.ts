import { useWidgetEvents, WidgetEvent } from '@jumperexchange/widget';
import type { NavigationTabKey } from '@jumperexchange/widget';
import { useEffect, useMemo, useRef } from 'react';
import { useUrlParams } from '@/hooks/useUrlParams';
import { composeWidgetTrackingHandlers } from '@/components/Widgets/tracking/composeWidgetTrackingHandlers';
import type { WidgetTrackingUrlParams } from '@/components/Widgets/tracking/WidgetTrackingSession';
import { createWidgetTrackingSession } from '@/components/Widgets/tracking/WidgetTrackingSession';
import type { WidgetEventTrackerConfig } from '@/components/Widgets/tracking/types';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
} from '@/components/Widgets/WidgetEventsManager';
import { useUserTracking } from '@/hooks/userTracking';
import { useTokens } from '@/hooks/useTokens';

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

  useEffect(() => {
    const handler = ({ tab }: { tab: NavigationTabKey }) => {
      session.onTabChanged(tab);
    };
    widgetEvents.on(WidgetEvent.NavigationTabChanged, handler);
    return () => {
      widgetEvents.off(WidgetEvent.NavigationTabChanged, handler);
    };
  }, [widgetEvents, session]);

  return session;
};
