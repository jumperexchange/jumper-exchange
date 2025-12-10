import { useMissionStore } from 'src/stores/mission/MissionStore';
import type { EntityWidgetProps } from '../base/Widget.types';
import type { FC } from 'react';
import { useMemo } from 'react';
import { ZapDepositBackendWidget } from '../base/ZapWidget/ZapDepositBackendWidget';
import type { ZapWidgetContext } from '../widgetConfig/types';
import { TaskType } from 'src/types/strapi';
import envConfig from 'src/config/env-config';

interface MissionZapDepositWidgetProps extends EntityWidgetProps {}

export const MissionZapDepositWidget: FC<MissionZapDepositWidgetProps> = ({
  customInformation,
}) => {
  const {
    // destinationChain,
    // destinationToken,
    // sourceChain,
    // sourceToken,
    // fromAmount,
    toAddress,
    currentActiveTaskType,
    // missionChainIds,
  } = useMissionStore();

  const ctx: ZapWidgetContext = useMemo(() => {
    return {
      formData: {
        toAddress,
        // destinationChain,
        // destinationToken,
        // sourceChain,
        // sourceToken,
        // fromAmount,
      },
      taskType: (currentActiveTaskType || TaskType.Zap) as TaskType.Zap,
    };
  }, [
    // destinationChain,
    // destinationToken,
    // sourceChain,
    // sourceToken,
    // fromAmount,
    toAddress,
    currentActiveTaskType,
  ]);

  return (
    <ZapDepositBackendWidget
      ctx={ctx}
      customInformation={customInformation}
      integrator={envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_ZAP}
    />
  );
};
