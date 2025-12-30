'use client';

import type { FormState } from '@lifi/widget';
import {
  ChainType,
  LiFiWidget,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useWidgetTrackingContext } from 'src/providers/WidgetTrackingProvider';
import { useMenuStore } from 'src/stores/menu/MenuStore';
import type { WidgetProps } from '../Widget.types';
import { useAccount } from '@lifi/wallet-management';
import { useUrlParams } from 'src/hooks/useUrlParams';
import { ZapPlaceholderWidget } from './ZapPlaceholderWidget';
import { useShowZapPlaceholderWidget } from './hooks';
import { useWidgetConfig } from '../../widgetConfig/useWidgetConfig';
import type { ZapWidgetContext } from '../../widgetConfig/types';
import { ZapDepositSettings } from './ZapDepositSettings';
import { WidgetSkeleton } from '../WidgetSkeleton';
import { capitalizeString } from 'src/utils/capitalizeString';
import { useTranslation } from 'react-i18next';
import { ZapDepositSuccessMessage } from './ZapDepositSuccessMessage';
import type { ZapDataResponse } from 'src/providers/ZapInitProvider/ModularZaps/zap.jumper-backend';
import type { ParseKeys } from 'i18next';

interface ZapDepositBackendWidgetProps extends Omit<WidgetProps, 'type'> {
  ctx: ZapWidgetContext;
  zapData?: ZapDataResponse | null;
  isZapDataSuccess?: boolean;
  refetchDepositToken?: () => void;
  depositSuccessMessageKey?: ParseKeys<'translation'>;
  integrator: string;
}

export const ZapDepositBackendWidget: FC<ZapDepositBackendWidgetProps> = ({
  zapData,
  isZapDataSuccess,
  refetchDepositToken,
  customInformation,
  ctx,
  depositSuccessMessageKey,
  integrator,
}) => {
  const { t } = useTranslation();

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const formRef = useRef<FormState>(null);

  const { account } = useAccount();
  const chainType = account?.chainType;
  const isEvmWallet = chainType === ChainType.EVM;

  const showZapPlaceholderWidget = useShowZapPlaceholderWidget(account);

  const { setDestinationChainTokenForTracking } = useWidgetTrackingContext();

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [zapData?.meta.name]);

  const partnerName = useMemo(() => {
    return zapData?.meta.name ? capitalizeString(zapData.meta.name) : '';
  }, [zapData?.meta.name]);

  const toToken = useMemo(() => {
    return zapData?.market?.address;
  }, [zapData?.market?.address]);

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
      integrator,
      keyPrefix: 'zap.backend',
      // variant: 'wide' as const,
      formData: {
        minFromAmountUSD,
      },
    };
  }, [ctx, minFromAmountUSD, poolName, integrator]);

  useEffect(() => {
    if (toChain && toToken) {
      setDestinationChainTokenForTracking({
        chainId: toChain,
        tokenAddress: toToken,
      });
    }
  }, [toChain, toToken, setDestinationChainTokenForTracking]);

  const widgetEvents = useWidgetEvents();
  // Custom effect to refetch the balance
  useEffect(() => {
    function onRouteExecutionCompleted() {
      refetchDepositToken?.();
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
        style={widgetConfig.theme?.container}
      />
    );
  }

  return isZapDataSuccess && toChain && toToken ? (
    <LiFiWidget
      formRef={formRef}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
      contractCompactComponent={
        <ZapDepositSuccessMessage
          partnerName={partnerName}
          t={t}
          messageKey={depositSuccessMessageKey}
        />
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
