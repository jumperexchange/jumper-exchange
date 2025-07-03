import { useMissionStore } from 'src/stores/mission/MissionStore';
import { EntityWidgetProps } from '../base/Widget.types';
import { FC, useMemo } from 'react';
import { ZapDepositWidget } from '../base/ZapWidget/ZapDepositWidget';
import { WalletProviderZap } from 'src/providers/WalletProvider/WalletProviderZap';
import { ConfigContext } from '../widgetConfig/types';

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

  return (
    <WalletProviderZap>
      <ZapDepositWidget ctx={ctx} customInformation={customInformation} />
    </WalletProviderZap>
  );
};
