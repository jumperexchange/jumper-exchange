import type { WidgetEvent, widgetEvents, WidgetEvents } from '@lifi/widget';

export type WidgetEventsConfig = {
  [K in WidgetEvent]?: (data: WidgetEvents[K]) => void;
};

export type WidgetEventEmitter = typeof widgetEvents; // delegate that type to the widget library

export const setupWidgetEvents = (
  config: WidgetEventsConfig,
  widgetEvents: WidgetEventEmitter,
) => {
  Object.entries(config).forEach(([event, handler]) => {
    // @ts-expect-error - typescript won't let us easily type: event is a WidgetEvent, and handler is EXACTLY the corresponding function.
    widgetEvents.on(event, handler);
  });
};

export const teardownWidgetEvents = (
  config: WidgetEventsConfig,
  widgetEvents: WidgetEventEmitter,
) => {
  Object.entries(config).forEach(([event, handler]) => {
    // @ts-expect-error - See the setup version
    widgetEvents.off(event, handler);
  });
};
