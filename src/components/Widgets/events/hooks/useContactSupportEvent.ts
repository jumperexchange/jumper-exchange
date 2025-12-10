'use client';
import { useMenuStore } from '@/stores/menu';
import { useWidgetEvents } from '@lifi/widget';
import { useEffect } from 'react';
import type { WidgetEventsConfig } from '../../WidgetEventsManager';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
} from '../../WidgetEventsManager';

export const useContactSupportEvent = () => {
  const widgetEvents = useWidgetEvents();
  const setSupportModalState = useMenuStore(
    (state) => state.setSupportModalState,
  );

  useEffect(() => {
    const contactSupport = () => {
      setSupportModalState(true);
    };
    const config: WidgetEventsConfig = { contactSupport };

    setupWidgetEvents(config, widgetEvents);
    return () => teardownWidgetEvents(config, widgetEvents);
  }, [widgetEvents, setSupportModalState]);
};
