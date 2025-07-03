import { useMissionStore } from 'src/stores/mission/MissionStore';
import { EntityWidgetProps } from '../base/Widget.types';
import { FC, useMemo } from 'react';
import { ZapWidget as BaseZapWidget } from '../base/ZapWidget/ZapWidget';
import { WalletProviderZap } from 'src/providers/WalletProvider/WalletProviderZap';

interface MissionZapWidgetProps extends EntityWidgetProps {}

export const MissionZapWidget: FC<MissionZapWidgetProps> = ({
  customInformation,
}) => {
  const {
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
    currentActiveTaskType,
    // missionChainIds,
  } = useMissionStore();

  const ctx = useMemo(() => {
    return {
      destinationChain,
      destinationToken,
      sourceChain,
      sourceToken,
      fromAmount,
      toAddress,
      currentActiveTaskType,
    };
  }, [
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
    currentActiveTaskType,
  ]);

  return (
    <WalletProviderZap>
      <BaseZapWidget ctx={ctx} customInformation={customInformation} />
    </WalletProviderZap>
  );
};
