'use client';

import { ClientOnly } from 'src/components/ClientOnly';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { TaskType } from '../hooks';
import { MissionWidgetColumnContainer } from './MissionWidget.style';
import { ZapWidget } from './variants/ZapWidget/ZapWidget';
import { BaseWidget } from './variants/BaseWidget/BaseWidget';
import { CustomInformation } from 'src/types/loyaltyPass';
import { FC } from 'react';
import { MissionWidgetSkeleton } from './MissionWidgetSkeleton';
import { WalletProviderZap } from 'src/providers/WalletProvider/WalletProviderZap';

export interface MissionWidgetProps {
  customInformation?: CustomInformation;
}

export const MissionWidget: FC<MissionWidgetProps> = ({
  customInformation,
}) => {
  // @Note create factory for displaying the mission completed screen instead of the widget
  const { currentActiveTaskType } = useMissionStore();

  if (currentActiveTaskType === TaskType.Zap && !customInformation) {
    return <MissionWidgetSkeleton />;
  }

  return (
    <MissionWidgetColumnContainer>
      <ClientOnly>
        {currentActiveTaskType === TaskType.Zap ? (
          <WalletProviderZap>
            <ZapWidget customInformation={customInformation} />
          </WalletProviderZap>
        ) : (
          <BaseWidget />
        )}
      </ClientOnly>
    </MissionWidgetColumnContainer>
  );
};
