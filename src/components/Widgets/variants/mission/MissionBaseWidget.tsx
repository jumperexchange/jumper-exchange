import { useMissionStore } from 'src/stores/mission/MissionStore';
import { EntityWidgetProps } from '../base/Widget.types';
import { FC, useMemo } from 'react';
import { Widget } from '../base/Widget';
import { ConfigContext } from '../widgetConfig/types';

interface MissionBaseWidgetProps extends EntityWidgetProps {}

export const MissionBaseWidget: FC<MissionBaseWidgetProps> = () => {
  const {
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
    currentActiveTaskType,
    taskTitle,
    allowBridge,
    allowExchange,
    // missionChainIds,
  } = useMissionStore();

  const ctx: ConfigContext = useMemo(() => {
    return {
      allowBridge,
      allowExchange,
      destinationChain,
      destinationToken,
      sourceChain,
      sourceToken,
      fromAmount,
      toAddress,
      taskType: currentActiveTaskType,
      overrideHeader: taskTitle,
    };
  }, [
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
    currentActiveTaskType,
    taskTitle,
  ]);

  return <Widget ctx={ctx} />;
};
