'use client';

import {
  ChainType,
  LiFiWidget,
  Route,
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import uniqBy from 'lodash/uniqBy';
import { FC, useEffect, useMemo } from 'react';
import { useWidgetTrackingContext } from 'src/providers/WidgetTrackingProvider';
import { useZapInitContext } from 'src/providers/ZapInitProvider/ZapInitProvider';
import { useMenuStore } from 'src/stores/menu/MenuStore';
import { WidgetProps } from '../Widget.types';
import { WidgetSkeleton } from '../WidgetSkeleton';
import { ZapDepositSettings } from './ZapDepositSettings';
import { ZapPlaceholderWidget } from './ZapPlaceholderWidget';
import { useWidgetConfig } from '../../widgetConfig/useWidgetConfig';
import { ZapWidgetContext } from '../../widgetConfig/types';

interface ZapDepositWidgetProps extends Omit<WidgetProps, 'type'> {
  ctx: ZapWidgetContext;
}

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
    isMultisigEnvironment,
    isEmbeddedWallet,
    isEvmWallet,
    providers,
    toAddress,
    zapData,
    isZapDataSuccess,
    allowedChains,
    refetchDepositToken,
    setCurrentRoute,
  } = useZapInitContext();

  const { setDestinationChainTokenForTracking } = useWidgetTrackingContext();

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [zapData?.meta.name]);

  const toToken = useMemo(() => {
    return zapData?.market?.depositToken.address;
  }, [zapData?.market?.depositToken.address]);

  const toChain = useMemo(() => {
    return zapData?.market?.depositToken.chainId;
  }, [zapData?.market?.depositToken.chainId]);

  const minFromAmountUSD = useMemo(() => {
    return Number(projectData?.minFromAmountUSD ?? '0');
  }, [projectData?.minFromAmountUSD]);

  const enhancedCtx = useMemo(() => {
    return {
      ...ctx,
      integrator: projectData.integrator,
      formData: {
        minFromAmountUSD,
      },
      zapPoolName: poolName,
    };
  }, [ctx, poolName, projectData.integrator, minFromAmountUSD]);

  const widgetConfig = useWidgetConfig('zap', enhancedCtx);

  // @Note: we want to ensure that we exclude the lp token from possible "Pay With" options [LF-15086]
  const lpToken = zapData?.market?.lpToken;
  if (lpToken) {
    const currentDenyList = widgetConfig.tokens?.deny ?? [];
    const newDenyList = uniqBy([...currentDenyList, lpToken], 'address');

    widgetConfig.tokens = widgetConfig.tokens ?? {};
    widgetConfig.tokens.deny = widgetConfig.tokens.deny ?? [];
    widgetConfig.tokens.deny = newDenyList;
  }

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

  useEffect(() => {
    setDestinationChainTokenForTracking({
      chainId: toChain,
      tokenAddress: toToken,
    });
  }, [toChain, toToken, setDestinationChainTokenForTracking]);

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

  if (isMultisigEnvironment || isEmbeddedWallet || !isEvmWallet) {
    return (
      <ZapPlaceholderWidget
        titleKey={
          !isEvmWallet
            ? 'widget.zap.placeholder.non-evm.title'
            : 'widget.zap.placeholder.embedded-multisig.title'
        }
        descriptionKey={
          !isEvmWallet
            ? 'widget.zap.placeholder.non-evm.description'
            : 'widget.zap.placeholder.embedded-multisig.description'
        }
      />
    );
  }

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
