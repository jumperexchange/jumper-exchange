'use client';

import {
  ChainType,
  FormState,
  LiFiWidget,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { useZapQuestIdStorage } from 'src/providers/hooks';
import { useWidgetTrackingContext } from 'src/providers/WidgetTrackingProvider';
import { useMenuStore } from 'src/stores/menu/MenuStore';
import { WidgetProps } from '../Widget.types';
import { useZapSupportedChains } from 'src/hooks/zaps/useZapSupportedChains';
import { ChainId } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { useSwitchChain } from 'wagmi';
import { useUrlParams } from 'src/hooks/useUrlParams';
import uniqBy from 'lodash/uniqBy';
import { useZapAllLpTokens } from 'src/hooks/zaps/useZapAllLpTokens';
import { ZapPlaceholderWidget } from './ZapPlaceholderWidget';
import { useShowZapPlaceholderWidget } from './hooks';
import { useWidgetConfig } from '../../widgetConfig/useWidgetConfig';
import { ZapWidgetContext } from '../../widgetConfig/types';
import { ZapDepositSettings } from './ZapDepositSettings';
import { WidgetSkeleton } from '../WidgetSkeleton';
import envConfig from 'src/config/env-config';
import { capitalizeString } from 'src/utils/capitalizeString';
import { useTranslation } from 'react-i18next';
import { ZapDepositSuccessMessage } from './ZapDepositSuccessMessage';

interface ZapDepositBackendWidgetProps extends Omit<WidgetProps, 'type'> {
  ctx: ZapWidgetContext;
}

export const ZapDepositBackendWidget: FC<ZapDepositBackendWidgetProps> = ({
  customInformation,
  ctx,
}) => {
  useZapQuestIdStorage();
  const { t } = useTranslation();

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const {
    zapData,
    isSuccess: isZapDataSuccess,
    refetchDepositToken,
  } = useEnhancedZapData(projectData);

  const formRef = useRef<FormState>(null);

  const { sourceChainToken } = useUrlParams();

  const { account } = useAccount();
  const { chainId, chainType } = account;
  const isEvmWallet = chainType === ChainType.EVM;
  const { switchChainAsync } = useSwitchChain();

  const showZapPlaceholderWidget = useShowZapPlaceholderWidget(account);

  const { data: zapSupportedChains } = useZapSupportedChains();
  const { data: allLpTokens } = useZapAllLpTokens();

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
  }, [zapData?.meta.name]);

  const partnerName = useMemo(() => {
    return zapData?.meta.name ? capitalizeString(zapData.meta.name) : '';
  }, [zapData?.meta.name]);

  const toToken = useMemo(() => {
    return zapData?.market?.depositToken.address;
  }, [zapData?.market?.depositToken.address]);

  const toChain = useMemo(() => {
    return zapData?.market?.depositToken.chainId;
  }, [zapData?.market?.depositToken.chainId]);

  const minFromAmountUSD = useMemo(() => {
    return projectData?.minFromAmountUSD
      ? Number(projectData?.minFromAmountUSD)
      : undefined;
  }, [projectData?.minFromAmountUSD]);

  const enhancedCtx = useMemo(() => {
    return {
      ...ctx,
      zapPoolName: poolName,
      integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN,
      keyPrefix: 'zap.backend',
      // variant: 'wide' as const,
      formData: {
        minFromAmountUSD,
      },
    };
  }, [ctx, minFromAmountUSD, poolName]);

  useEffect(() => {
    if (!chainId || allowedChains.includes(chainId)) {
      return;
    }

    switchChainAsync({ chainId: ChainId.ETH });
  }, [chainId, allowedChains, switchChainAsync]);

  useEffect(() => {
    if (
      !formRef.current ||
      !sourceChainToken?.chainId ||
      allowedChains.includes(sourceChainToken.chainId)
    ) {
      return;
    }

    formRef.current?.setFieldValue('fromToken', undefined, {
      setUrlSearchParam: true,
    });
    formRef.current?.setFieldValue('fromChain', undefined, {
      setUrlSearchParam: true,
    });
  }, [sourceChainToken, allowedChains]);

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

    const onRouteContactSupport = () => {
      setSupportModalState(true);
    };

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );

    widgetEvents.on(WidgetEvent.ContactSupport, onRouteContactSupport);

    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
      widgetEvents.off(WidgetEvent.ContactSupport, onRouteContactSupport);
    };
  }, [widgetEvents, refetchDepositToken, setSupportModalState]);

  const widgetConfig = useWidgetConfig('zap', enhancedCtx);

  // @Note: we want to ensure that the chains are set in the widget config without any delay
  if (allowedChains) {
    widgetConfig.chains = {
      allow: allowedChains,
    };
  }

  // @Note: we want to ensure that we exclude the lp token from possible "Pay With" options [LF-15086]
  if (allLpTokens) {
    const currentDenyList = widgetConfig.tokens?.deny ?? [];
    const newDenyList = uniqBy([...currentDenyList, ...allLpTokens], 'address');

    widgetConfig.tokens = widgetConfig.tokens ?? {};
    widgetConfig.tokens.deny = widgetConfig.tokens.deny ?? [];
    widgetConfig.tokens.deny = newDenyList;
  }

  if (showZapPlaceholderWidget || !isEvmWallet) {
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

  return isZapDataSuccess ? (
    <LiFiWidget
      formRef={formRef}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
      contractCompactComponent={
        <ZapDepositSuccessMessage partnerName={partnerName} t={t} />
      }
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
