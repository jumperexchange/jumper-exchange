import { useMissionStore } from 'src/stores/mission/MissionStore';
import { EntityWidgetProps } from '../base/Widget.types';
import { FC, useMemo } from 'react';
import { ZapDepositWidget } from '../base/ZapWidget/ZapDepositWidget';
import { ZapWidgetContext } from '../widgetConfig/types';
import { TaskType } from 'src/types/strapi';

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

  return <ZapDepositWidget ctx={ctx} customInformation={customInformation} />;
};
