'use client';

import { FC, useEffect, useMemo } from 'react';
import { LiFiWidget, Route, useWidgetEvents, WidgetEvent } from '@lifi/widget';
import {
  useBaseFormWidgetConfig,
  useBaseWidgetConfig,
  useSubVariantWidgetConfig,
} from '../../hooks';
import { useInitializeZapConfig, useZapRPCWidgetConfig } from './hooks';
import { formatUnits } from 'viem/utils';
import { MissionWidgetProps } from '../../MissionWidget';
import { DepositCard } from 'src/components/ZapWidget/Deposit/DepositCard';
import { MissionWidgetSkeleton } from '../../MissionWidgetSkeleton';

interface ZapWidgetProps extends MissionWidgetProps {}

export const ZapWidget: FC<ZapWidgetProps> = ({ customInformation }) => {
  const baseConfig = useBaseWidgetConfig();
  const subVariantConfig = useSubVariantWidgetConfig();
  const formConfig = useBaseFormWidgetConfig();

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const claimingIds = useMemo(() => {
    return customInformation?.claimingIds;
  }, [customInformation?.claimingIds]);

  const {
    providers,
    toAddress,
    zapData,
    isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    refetchDepositToken,
    setCurrentRoute,
  } = useInitializeZapConfig(projectData);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [JSON.stringify(zapData)]);

  const zapConfig = useZapRPCWidgetConfig(providers, toAddress);

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

  const token = useMemo(
    () =>
      isZapDataSuccess && zapData
        ? {
            chainId: zapData.market?.depositToken.chainId,
            address: zapData.market?.depositToken.address as `0x${string}`,
            symbol: zapData.market?.depositToken.symbol,
            name: zapData.market?.depositToken.name,
            decimals: zapData.market?.depositToken.decimals,
            priceUSD: '0',
            coinKey:
              zapData.market?.depositToken.symbol ||
              zapData.market?.depositToken.name ||
              '',
            logoURI: zapData.market?.depositToken.logoURI,
            amount: BigInt(0),
          }
        : null,
    [isZapDataSuccess, zapData],
  );

  const lpTokenDecimals = Number(depositTokenDecimals ?? 18);

  const analytics = useMemo(
    () => ({
      ...(zapData?.analytics || {}), // Provide default empty object
      position: depositTokenData
        ? formatUnits(depositTokenData as bigint, lpTokenDecimals)
        : 0,
    }),
    [zapData, lpTokenDecimals],
  );

  const config = useMemo(() => {
    return {
      ...baseConfig,
      ...subVariantConfig,
      ...zapConfig,
      ...formConfig,
    };
  }, [baseConfig, subVariantConfig, zapConfig, formConfig]);

  return token ? (
    <LiFiWidget
      contractComponent={
        <DepositCard
          poolName={poolName}
          underlyingToken={zapData?.market?.depositToken}
          token={token}
          chainId={zapData?.market?.depositToken.chainId}
          contractTool={zapData?.meta}
          analytics={analytics}
          contractCalls={[]}
          claimingIds={claimingIds}
        />
      }
      config={config}
      integrator={config.integrator}
    />
  ) : (
    <MissionWidgetSkeleton />
  );
};
