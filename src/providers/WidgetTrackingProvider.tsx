'use client';

import type { ChainTokenSelected } from '@jumperexchange/widget';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';
import {
  createWidgetTrackerConfig,
  type CreateWidgetTrackerConfigOptions,
  type WidgetTrackingVariant,
} from '@/components/Widgets/tracking/widgetTrackingPresets';
import type { WidgetEventTrackerConfig } from '@/components/Widgets/tracking/types';
import { useWidgetTracking } from '@/hooks/useWidgetTracking';

interface WidgetTrackingState {
  setDestinationChainTokenForTracking: (
    destinationToken: ChainTokenSelected,
  ) => void;
}

export const WidgetTrackingContext = createContext<WidgetTrackingState | null>(
  null,
);

export const useWidgetTrackingContext = () => {
  const widgetTrackingContext = useContext(WidgetTrackingContext);

  if (widgetTrackingContext === null) {
    throw new Error(
      'This hook must be used within the "WidgetTrackingContext" provider',
    );
  }

  return widgetTrackingContext;
};

interface WidgetTrackingProviderProps extends PropsWithChildren {
  variant?: WidgetTrackingVariant;
  trackerConfig?: WidgetEventTrackerConfig;
  options?: CreateWidgetTrackerConfigOptions;
  enabled?: boolean;
  initialSourceToken?: ChainTokenSelected;
  initialDestinationToken?: ChainTokenSelected;
}

export const WidgetTrackingProvider: FC<WidgetTrackingProviderProps> = ({
  children,
  variant,
  trackerConfig,
  options,
  enabled = true,
  initialSourceToken,
  initialDestinationToken,
}) => {
  const resolvedConfig = enabled
    ? (trackerConfig ??
      (variant ? createWidgetTrackerConfig(variant, options) : {}))
    : {};

  const session = useWidgetTracking(resolvedConfig);

  useEffect(() => {
    if (initialSourceToken) {
      session.onSourceTokenSelected(initialSourceToken);
    }
    if (initialDestinationToken) {
      session.setDestinationTokenForTracking(initialDestinationToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      setDestinationChainTokenForTracking:
        session.setDestinationTokenForTracking,
    }),
    [session],
  );

  return (
    <WidgetTrackingContext.Provider value={value}>
      {children}
    </WidgetTrackingContext.Provider>
  );
};
