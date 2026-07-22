import { useAccount } from '@jumperexchange/wallet-management';
import type { FormState } from '@jumperexchange/widget';
import {
  ChainType,
  LiFiWidget,
  useWidgetEvents,
  WidgetEvent,
} from '@jumperexchange/widget';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import envConfig from '@/config/env-config';
import { useMenuStore } from '@/stores/menu';
import { TaskType } from '@/types/strapi';
import type { ZapDataResponse } from '@/types/zaps';

import type { ZapWidgetContext } from '../../widgetConfig/types';
import { useWidgetConfig } from '../../widgetConfig/useWidgetConfig';
import type { WidgetProps } from '../Widget.types';
import { WidgetSkeleton } from '../WidgetSkeleton';

interface ZapWithdrawWidgetProps extends Omit<WidgetProps, 'type'> {
  ctx: ZapWidgetContext;
  zapData?: ZapDataResponse | null;
  refetchWithdrawToken?: () => void;
}

export const ZapWithdrawWidget: FC<ZapWithdrawWidgetProps> = ({
  zapData,
  customInformation,
  ctx,
  refetchWithdrawToken,
}) => {
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const formRef = useRef<FormState>(null);

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  const fromToken = useMemo(() => {
    if (!zapData?.market?.address) {
      return undefined;
    }
    return {
      tokenAddress: zapData?.market?.address,
      tokenSymbol: zapData?.market?.lpToken.symbol ?? '',
    };
  }, [zapData?.market?.address, zapData?.market?.lpToken.symbol]);

  const toToken = useMemo(() => {
    const depositToken = zapData?.market?.depositToken;
    if (!depositToken?.address) {
      return undefined;
    }
    return {
      tokenAddress: depositToken.address,
      tokenSymbol: depositToken.symbol ?? '',
    };
  }, [zapData?.market?.depositToken]);

  const fromChain = useMemo(() => {
    if (!projectData?.chainId) {
      return undefined;
    }
    return {
      chainId: projectData?.chainId,
      chainKey: projectData?.chain ?? '',
    };
  }, [projectData?.chainId, projectData?.chain]);

  const toChain = useMemo(() => {
    if (!projectData?.chainId) {
      return undefined;
    }
    return {
      chainId: projectData?.chainId,
      chainKey: projectData?.chain ?? '',
    };
  }, [projectData?.chainId, projectData?.chain]);

  const enhancedCtx = useMemo(() => {
    return {
      ...ctx,
      taskType: TaskType.Zap as const,
      subTaskType: 'withdraw' as const,
      integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN,
      keyPrefix: 'zap.backend',
      disabledUI: { fromToken: true },
      hiddenUI: { fromToken: true },
      formData: {
        sourceToken: fromToken,
        sourceChain: fromChain,
        destinationChain: toChain,
        destinationToken: toToken,
      },
    };
  }, [ctx, fromToken, fromChain, toChain, toToken]);

  const widgetEvents = useWidgetEvents();
  // Custom effect to refetch the balance
  useEffect(() => {
    function onRouteExecutionCompleted() {
      refetchWithdrawToken?.();
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
  }, [widgetEvents, refetchWithdrawToken, setSupportModalState]);

  const { config: widgetConfig, isReady } = useWidgetConfig('zap', enhancedCtx);

  return fromChain && fromToken && isReady ? (
    <LiFiWidget
      formRef={formRef}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
    />
  ) : (
    <WidgetSkeleton />
  );
};
