import { useMissionStore } from 'src/stores/mission/MissionStore';
import { EntityWidgetProps } from '../base/Widget.types';
import { FC, useMemo } from 'react';
import { ZapWithdrawWidget } from '../base/ZapWidget/ZapWithdrawWidget';
import { ConfigContext } from '../widgetConfig/types';

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

  const ctx: ConfigContext = useMemo(() => {
    return {
      // destinationChain,
      // destinationToken,
      // sourceChain,
      // sourceToken,
      // fromAmount,
      toAddress,
      taskType: currentActiveTaskType,
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
