import { useCallback } from 'react';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';
import { EventTrackingTools, InitTrackingProps } from './userTracking.types';

export function useInitUserTracking() {
  const initTracking = useCallback(
    /**
     * Initialize for Tracking with GA and HJ
     * (ARCx has its own Provider)
     *
     */
    async ({ disableTrackingTool }: InitTrackingProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTools.hotjar)) {
        !hotjar.initialized() &&
          hotjar.initialize(
            import.meta.env.VITE_HOTJAR_ID,
            import.meta.env.VITE_HOTJAR_SNIPPET_VERSION,
          );
      }
      if (!disableTrackingTool?.includes(EventTrackingTools.ga)) {
        ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_TRACKING_ID);
      }
    },
    [],
  );

  return {
    initTracking,
  };
}
