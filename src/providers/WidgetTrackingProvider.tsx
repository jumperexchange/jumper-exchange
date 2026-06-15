'use client';

import type { ChainTokenSelected } from '@lifi/widget';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
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
}

export const WidgetTrackingProvider: FC<WidgetTrackingProviderProps> = ({
  children,
  variant,
  trackerConfig,
  options,
}) => {
  const resolvedConfig =
    trackerConfig ??
    (variant ? createWidgetTrackerConfig(variant, options) : {});

  const session = useWidgetTracking(resolvedConfig);

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
