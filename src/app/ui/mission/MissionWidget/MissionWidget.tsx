'use client';

import { ClientOnly } from 'src/components/ClientOnly';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { CustomInformation } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { FC } from 'react';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import Box from '@mui/material/Box';
import { MissionBaseWidget } from 'src/components/Widgets/variants/mission/MissionBaseWidget';
import { MissionZapDepositWidget } from 'src/components/Widgets/variants/mission/MissionZapDepositWidget';
// import { MissionZapWithdrawWidget } from 'src/components/Widgets/variants/mission/MissionZapWithdrawWidget';
import { MissionComplete } from './MissionComplete';
import { MissionFormWidget } from './MissionFormWidget';
import { DepositPoolCard } from 'src/components/ZapWidget/DepositPoolCard/DepositPoolCard';
import { ZapWidgets } from 'src/components/Zap/ZapWidgets';

export interface MissionWidgetProps {
  customInformation?: CustomInformation;
}

export const MissionWidget: FC<MissionWidgetProps> = ({
  customInformation,
}) => {
  const { currentActiveTaskType, isMissionCompleted } = useMissionStore();

  if (isMissionCompleted) {
    return <MissionComplete />;
  }

  if (
    currentActiveTaskType === TaskType.OnChain ||
    currentActiveTaskType === TaskType.OffChain
  ) {
    return <MissionFormWidget />;
  }

  if (currentActiveTaskType === TaskType.Zap && !customInformation) {
    return <WidgetSkeleton />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <ClientOnly>
        {currentActiveTaskType === TaskType.Zap ? (
          <ZapWidgets detailInformation={customInformation} />
        ) : (
          <MissionBaseWidget />
        )}
      </ClientOnly>
    </Box>
  );
};
