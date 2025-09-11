'use client';

import { HiddenUI, LiFiWidget } from '@lifi/widget';
import { FC, useMemo } from 'react';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { useZapQuestIdStorage } from 'src/providers/hooks';
import { useWidgetTrackingContext } from 'src/providers/WidgetTrackingProvider';
import { useMenuStore } from 'src/stores/menu/MenuStore';
import { useLiFiWidgetConfig } from '../../widgetConfig/hooks';
import { ConfigContext } from '../../widgetConfig/types';
import { WidgetProps } from '../Widget.types';
import { ZapDepositSettings } from './ZapDepositSettings';

interface ZapDepositBackendWidgetProps extends WidgetProps {}

export const ZapDepositBackendWidget: FC<ZapDepositBackendWidgetProps> = ({
  customInformation,
  ctx,
}) => {
  useZapQuestIdStorage();

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const {
    zapData,
    isSuccess: isZapDataSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  } = useEnhancedZapData(projectData);

  const { setDestinationChainTokenForTracking } = useWidgetTrackingContext();

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  // const poolName = useMemo(() => {
  //   return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  // }, [JSON.stringify(zapData ?? {})]);

  const toToken = useMemo(() => {
    return zapData?.market?.depositToken.address;
  }, [JSON.stringify(zapData ?? {})]);

  const toChain = useMemo(() => {
    return zapData?.market?.depositToken.chainId;
  }, [JSON.stringify(zapData ?? {})]);

  // const minFromAmountUSD = useMemo(() => {
  //   return Number(projectData?.minFromAmountUSD ?? '0');
  // }, [projectData?.minFromAmountUSD]);

  const enhancedCtx = useMemo(() => {
    const baseOverrides: ConfigContext['baseOverrides'] = {
      integrator: 'zap.morpho',
      minFromAmountUSD: customInformation?.projectData?.minFromAmountUSD,
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
  }, [JSON.stringify(ctx), projectData.integrator]);

  const widgetConfig = useLiFiWidgetConfig(enhancedCtx);
  delete widgetConfig.bridges;

  return (
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
  );
};
