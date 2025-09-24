import { useMissionStore } from 'src/stores/mission/MissionStore';
import { EntityWidgetProps } from '../base/Widget.types';
import { FC, useMemo } from 'react';
import { ZapWithdrawWidget } from '../base/ZapWidget/ZapWithdrawWidget';
import { ZapWidgetContext } from '../widgetConfig/types';
import { TaskType } from 'src/types/strapi';

interface MissionZapWithdrawWidgetProps extends EntityWidgetProps {}

export const MissionZapWithdrawWidget: FC<MissionZapWithdrawWidgetProps> = ({
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
      taskType: currentActiveTaskType as TaskType.Zap,
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

  return <ZapWithdrawWidget ctx={ctx} customInformation={customInformation} />;
};
