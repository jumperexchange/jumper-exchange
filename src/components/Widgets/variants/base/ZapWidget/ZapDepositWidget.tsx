'use client';

import { FC, useEffect, useMemo } from 'react';
import { LiFiWidget, Route, useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useInitializeZapConfig } from './useInitializeZapConfig';
import { WidgetSkeleton } from '../WidgetSkeleton';
import { useLiFiWidgetConfig } from '../../widgetConfig/hooks';
import { WidgetProps } from '../Widget.types';
import { ConfigContext } from '../../widgetConfig/types';

interface ZapDepositWidgetProps extends WidgetProps {}

export const ZapDepositWidget: FC<ZapDepositWidgetProps> = ({
  customInformation,
  ctx,
}) => {
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const {
    isInitialized,
    providers,
    toAddress,
    zapData,
    isZapDataSuccess,
    refetchDepositToken,
    setCurrentRoute,
  } = useInitializeZapConfig(projectData);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [JSON.stringify(zapData ?? {})]);

  const enhancedCtx = useMemo(() => {
    const baseOverrides: ConfigContext['baseOverrides'] = {
      integrator: projectData.integrator,
      theme: {
        header: {
          display: 'none',
        },
      },
    };

    return {
      ...ctx,
      includeZap: true,
      zapProviders: providers,
      zapToAddress: toAddress,
      baseOverrides,
    };
  }, [
    JSON.stringify(ctx),
    poolName,
    providers,
    toAddress,
    projectData.integrator,
  ]);

  const widgetConfig = useLiFiWidgetConfig(enhancedCtx);

  const widgetEvents = useWidgetEvents();
  // Custom effect to refetch the balance
  useEffect(() => {
    function onRouteExecutionCompleted() {
      refetchDepositToken();
    }

    function onRouteExecutionStarted(route: Route) {
      setCurrentRoute(route);
    }

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );

    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionStarted,
        onRouteExecutionStarted,
      );
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
    };
  }, [widgetEvents, refetchDepositToken, setCurrentRoute]);

  return isInitialized && isZapDataSuccess ? (
    <LiFiWidget
      key={poolName}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
    />
  ) : (
    <WidgetSkeleton />
  );
};
