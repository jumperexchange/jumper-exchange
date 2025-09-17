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
import { useZapSupportedChains } from 'src/hooks/zaps/useZapSupportedChains';
import { ChainId } from '@lifi/sdk';

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

  const { data: zapSupportedChains } = useZapSupportedChains();

  const { setDestinationChainTokenForTracking } = useWidgetTrackingContext();

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  const allowedChains = useMemo(() => {
    // @Note: This is a fallback for when the zap supported chains are not loaded yet
    if (!zapSupportedChains) {
      return [
        ChainId.ETH,
        ChainId.BSC,
        ChainId.ARB,
        ChainId.BAS,
        ChainId.AVA,
        ChainId.POL,
        ChainId.SCL,
        ChainId.OPT,
        ChainId.DAI,
        ChainId.UNI,
        ChainId.SEI,
        ChainId.SON,
        ChainId.APE,
        ChainId.WCC,
        ChainId.HYP,
        // @Note: Even though docs say they are supported, they are not retrieved from the API
        // https://docs.biconomy.io/supportedNetworks#-supported-chains
        // ChainId.KAT,
        // ChainId.LSK,
      ];
    }

    const zapSupportedChainsIds = zapSupportedChains.map(
      (chain) => chain.chainId,
    );

    return Object.values(ChainId).filter((chainId): chainId is ChainId =>
      zapSupportedChainsIds?.includes(chainId.toString()),
    );
  }, [zapSupportedChains]);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [JSON.stringify(zapData ?? {})]);

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
      zapPoolName: poolName,
      baseOverrides,
    };
  }, [JSON.stringify(ctx), projectData.integrator, poolName]);

  const widgetConfig = useLiFiWidgetConfig(enhancedCtx);

  // @Note: we want to ensure that the chains are set in the widget config without any delay
  if (allowedChains) {
    widgetConfig.chains = {
      allow: allowedChains,
    };
  }

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
