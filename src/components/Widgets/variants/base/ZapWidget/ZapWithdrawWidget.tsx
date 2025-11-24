import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { WidgetProps } from '../Widget.types';
import { WidgetSkeleton } from '../WidgetSkeleton';
import type { ZapDataResponse } from '@/providers/ZapInitProvider/ModularZaps/zap.jumper-backend';
import envConfig from '@/config/env-config';
import { useWidgetConfig } from '../../widgetConfig/useWidgetConfig';
import { useMenuStore } from '@/stores/menu';
import type { FormState } from '@lifi/widget';
import {
  useWidgetEvents,
  WidgetEvent,
  LiFiWidget,
  DisabledUI,
} from '@lifi/widget';
import type { ZapWidgetContext } from '../../widgetConfig/types';
import { TaskType } from '@/types/strapi';

interface ZapWithdrawWidgetProps extends Omit<WidgetProps, 'type'> {
  ctx: ZapWidgetContext;
  zapData?: ZapDataResponse | null;
}

export const ZapWithdrawWidget: FC<ZapWithdrawWidgetProps> = ({
  zapData,
  customInformation,
  ctx,
}) => {
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const formRef = useRef<FormState>(null);

  // const { setSourceChainTokenForTracking } = useWidgetTrackingContext();

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  const fromToken = useMemo(() => {
    if (!zapData?.market?.address) {
      return undefined;
    }
    return {
      tokenAddress: zapData?.market?.address,
      tokenSymbol: zapData?.market?.lpToken.symbol,
    };
  }, [zapData?.market?.address, zapData?.market?.lpToken.symbol]);

  const fromChain = useMemo(() => {
    if (!projectData?.chainId || !projectData?.chain) {
      return undefined;
    }
    return {
      chainId: projectData?.chainId,
      chainKey: projectData?.chain,
    };
  }, [projectData?.chainId, projectData?.chain]);

  const enhancedCtx = useMemo(() => {
    return {
      ...ctx,
      taskType: TaskType.Zap as const,
      subTaskType: 'withdraw' as const,
      integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN,
      keyPrefix: 'zap.backend',
      disabledUI: [DisabledUI.FromToken],
      formData: {
        sourceToken: fromToken,
        sourceChain: fromChain,
      },
    };
  }, [ctx, fromToken, fromChain]);

  const widgetEvents = useWidgetEvents();
  // Custom effect to refetch the balance
  useEffect(() => {
    const onRouteContactSupport = () => {
      setSupportModalState(true);
    };

    widgetEvents.on(WidgetEvent.ContactSupport, onRouteContactSupport);

    return () => {
      widgetEvents.off(WidgetEvent.ContactSupport, onRouteContactSupport);
    };
  }, [widgetEvents, setSupportModalState]);

  const widgetConfig = useWidgetConfig('zap', enhancedCtx);

  return fromChain && fromToken ? (
    <LiFiWidget
      formRef={formRef}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
    />
  ) : (
    <WidgetSkeleton />
  );
};
