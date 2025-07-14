'use client';

import { ClientOnly } from 'src/components/ClientOnly';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { CustomInformation } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { FC, ReactNode } from 'react';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import Box from '@mui/material/Box';
import { MissionBaseWidget } from 'src/components/Widgets/variants/mission/MissionBaseWidget';
import { MissionComplete } from './MissionComplete';
import { MissionFormWidget } from './MissionFormWidget';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import { ZapWidgetStack } from 'src/components/Zap/ZapWidgetStack';

export interface MissionWidgetProps {
  customInformation?: CustomInformation;
}

export const MissionWidget: FC<MissionWidgetProps> = ({
  customInformation,
}) => {
  const { currentActiveTaskType, isMissionCompleted } = useMissionStore();

  const renderContent = (): ReactNode => {
    if (isMissionCompleted) return <MissionComplete />;

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
      <ClientOnly>
        <MissionBaseWidget />
      </ClientOnly>
    );
  };

  const content = renderContent();

  const shouldWrapContent =
    isMissionCompleted || currentActiveTaskType !== TaskType.Zap;

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
