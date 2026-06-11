'use client';

import Box from '@mui/material/Box';
import type { FC, ReactNode } from 'react';
import { WidgetSkeleton } from '@/components/Widgets/variants/base/WidgetSkeleton';
import { MissionBaseWidget } from '@/components/Widgets/variants/mission/MissionBaseWidget';
import { ZapWidgetStack } from '@/components/Zap/ZapWidgetStack';
import { MISSION_WIDGET_ELEMENT_ID } from '@/const/quests';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import { useMissionStore } from '@/stores/mission/MissionStore';
import type { CustomInformation } from '@/types/loyaltyPass';
import { TaskType } from '@/types/strapi';
import { MissionFormWidget } from './MissionFormWidget';
import { MissionTaskComplete } from './MissionTaskComplete';
import { MissionEnded } from './MissionEnded';
import { MissionVerifyWallet } from './MissionVerifyWallet';

export interface MissionWidgetProps {
  customInformation?: CustomInformation;
}

export const MissionWidget: FC<MissionWidgetProps> = ({
  customInformation,
}) => {
  const {
    currentActiveTaskType,
    isCurrentActiveTaskCompleted,
    missionHasEnded,
  } = useMissionStore();

  const renderContent = (): ReactNode => {
    if (missionHasEnded) {
      return <MissionEnded />;
    }

    if (currentActiveTaskType === TaskType.OnChainWalletOwnership) {
      return <MissionVerifyWallet isComplete={isCurrentActiveTaskCompleted} />;
    }

    if (isCurrentActiveTaskCompleted) {
      return <MissionTaskComplete />;
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

    if (currentActiveTaskType === TaskType.Zap) {
      return <ZapWidgetStack customInformation={customInformation} />;
    }

    return (
      <WidgetTrackingProvider variant="mission">
        <MissionBaseWidget />
      </WidgetTrackingProvider>
    );
  };

  const content = renderContent();

  const shouldWrapContent =
    isCurrentActiveTaskCompleted || currentActiveTaskType !== TaskType.Zap;

  return shouldWrapContent ? (
    <Box
      id={MISSION_WIDGET_ELEMENT_ID}
      sx={{
        width: '100%',
        position: { lg: 'sticky' },
        top: { lg: 124 },
      }}
    >
      {content}
    </Box>
  ) : (
    content
  );
};
