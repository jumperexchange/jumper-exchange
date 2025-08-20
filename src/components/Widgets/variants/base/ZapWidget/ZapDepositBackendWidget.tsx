'use client';

import { HiddenUI, LiFiWidget } from '@lifi/widget';
import { FC, useMemo } from 'react';
import { useWidgetTrackingContext } from 'src/providers/WidgetTrackingProvider';
import { useMenuStore } from 'src/stores/menu/MenuStore';
import { useLiFiWidgetConfig } from '../../widgetConfig/hooks';
import { ConfigContext } from '../../widgetConfig/types';
import { WidgetProps } from '../Widget.types';

interface ZapDepositBackendWidgetProps extends WidgetProps {}

export const ZapDepositBackendWidget: FC<ZapDepositBackendWidgetProps> = ({
  customInformation,
  ctx,
}) => {
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  // const {
  //   isInitialized,
  //   isConnected,
  //   providers,
  //   toAddress,
  //   zapData,
  //   isZapDataSuccess,
  //   allowedChains,
  //   refetchDepositToken,
  //   setCurrentRoute,
  // } = useZapInitContext();

  const { setDestinationChainTokenForTracking } = useWidgetTrackingContext();

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  // const poolName = useMemo(() => {
  //   return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  // }, [JSON.stringify(zapData ?? {})]);

  // const toToken = useMemo(() => {
  //   return zapData?.market?.depositToken.address;
  // }, [JSON.stringify(zapData ?? {})]);

  // const toChain = useMemo(() => {
  //   return zapData?.market?.depositToken.chainId;
  // }, [JSON.stringify(zapData ?? {})]);

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
      variant: 'wide',
      keyPrefix: 'zap.backend',
    };

    return {
      ...ctx,
      includeZap: true,
      // zapPoolName: poolName,
      baseOverrides,
    };
  }, [JSON.stringify(ctx), projectData.integrator, minFromAmountUSD]);

  const widgetConfig = useLiFiWidgetConfig(enhancedCtx);

  console.log('data', customInformation);
  console.log('widgetconfig', widgetConfig);

  return (
    <>
      I am backend
      <LiFiWidget config={widgetConfig} integrator={widgetConfig.integrator} />
    </>
  );
};
