'use client';

import { FC, useEffect, useMemo } from 'react';
import {
  ChainType,
  HiddenUI,
  LiFiWidget,
  Route,
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { WidgetSkeleton } from '../WidgetSkeleton';
import { useLiFiWidgetConfig } from '../../widgetConfig/hooks';
import { WidgetProps } from '../Widget.types';
import { ConfigContext } from '../../widgetConfig/types';
import { ZapDepositSettings } from './ZapDepositSettings';
import { useZapInitContext } from 'src/providers/ZapInitProvider/ZapInitProvider';
import { useMenuStore } from 'src/stores/menu/MenuStore';

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
    isConnected,
    providers,
    toAddress,
    zapData,
    isZapDataSuccess,
    allowedChains,
    refetchDepositToken,
    setCurrentRoute,
  } = useZapInitContext();

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [JSON.stringify(zapData ?? {})]);

  const toToken = useMemo(() => {
    return zapData?.market?.depositToken.address;
  }, [JSON.stringify(zapData ?? {})]);

  const toChain = useMemo(() => {
    return zapData?.market?.depositToken.chainId;
  }, [JSON.stringify(zapData ?? {})]);

  const minFromAmountUSD = useMemo(() => {
    return Number(projectData?.minFromAmountUSD ?? '0');
  }, [projectData?.minFromAmountUSD]);

  const enhancedCtx = useMemo(() => {
    const baseOverrides: ConfigContext['baseOverrides'] = {
      integrator: projectData.integrator,
      minFromAmountUSD,
      hiddenUI: [
        HiddenUI.LowAddressActivityConfirmation,
        HiddenUI.GasRefuelMessage,
      ],
    };

    return {
      ...ctx,
      includeZap: true,
      zapPoolName: poolName,
      baseOverrides,
    };
  }, [JSON.stringify(ctx), poolName, projectData.integrator, minFromAmountUSD]);

  const widgetConfig = useLiFiWidgetConfig(enhancedCtx);

  // @Note: we want to ensure that the toAddress is set in the widget config without any delay
  if (toAddress) {
    widgetConfig.toAddress = {
      name: 'Smart Account',
      address: toAddress,
      chainType: ChainType.EVM,
    };
  }

  // @Note: we want to ensure that the providers are set in the widget config without any delay
  if (providers) {
    widgetConfig.sdkConfig = {
      ...(widgetConfig.sdkConfig ?? {}),
      providers,
    };
  }

  // @Note: we want to ensure that the chains are set in the widget config without any delay
  if (allowedChains) {
    widgetConfig.chains = {
      allow: allowedChains,
    };
  }

  const widgetEvents = useWidgetEvents();
  // Custom effect to refetch the balance
  useEffect(() => {
    function onRouteExecutionCompleted() {
      refetchDepositToken();
    }

    function onRouteExecutionStarted(route: Route) {
      console.warn('onRouteExecutionStarted', route.id);
      setCurrentRoute(route);
    }

    function onRouteExecutionUpdated(
      routeExecutionUpdate: RouteExecutionUpdate,
    ) {
      console.warn('onRouteExecutionUpdated', routeExecutionUpdate.route.id);
      setCurrentRoute(routeExecutionUpdate.route);
    }

    const onRouteContactSupport = () => {
      setSupportModalState(true);
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );

    widgetEvents.on(WidgetEvent.ContactSupport, onRouteContactSupport);

    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionStarted,
        onRouteExecutionStarted,
      );
      widgetEvents.off(
        WidgetEvent.RouteExecutionUpdated,
        onRouteExecutionUpdated,
      );
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
      widgetEvents.off(WidgetEvent.ContactSupport, onRouteContactSupport);
    };
  }, [
    widgetEvents,
    refetchDepositToken,
    setCurrentRoute,
    setSupportModalState,
  ]);

  return isZapDataSuccess &&
    ((isInitialized && !!toAddress) || !isConnected) ? (
    <LiFiWidget
      config={widgetConfig}
      integrator={widgetConfig.integrator}
      contractComponent={
        <ZapDepositSettings
          toChain={toChain}
          toToken={toToken}
          contractCalls={[]}
        />
      }
    />
  ) : (
    <WidgetSkeleton />
  );
};
