import { useCallback } from 'react';
import { hotjar } from 'react-hotjar';
import type { InitTrackingProps } from 'src/types';
import { EventTrackingTool } from 'src/types';

export function useInitUserTracking() {
  const initTracking = useCallback(
    /**
     * Initialize for Tracking with HJ
     * (ARCx has its own Provider)
     * (Google Analytics is initialized in index.html)
     */
    async ({ disableTrackingTool }: InitTrackingProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.Hotjar)) {
        !hotjar.initialized() &&
          hotjar.initialize(
            import.meta.env.VITE_HOTJAR_ID,
            import.meta.env.VITE_HOTJAR_SNIPPET_VERSION,
          );
      }
    },
    [],
  );

  return {
    initTracking,
  };
}
