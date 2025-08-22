'use client';

import { ClientOnly } from 'src/components/ClientOnly';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { CustomInformation } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { FC, ReactNode } from 'react';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import Box from '@mui/material/Box';
import { MissionBaseWidget } from 'src/components/Widgets/variants/mission/MissionBaseWidget';
import { MissionTaskComplete } from './MissionTaskComplete';
import { MissionFormWidget } from './MissionFormWidget';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import { ZapWidgetStack } from 'src/components/Zap/ZapWidgetStack';
import {
  TrackingAction,
  TrackingEventDataAction,
} from 'src/const/trackingKeys';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';

export interface MissionWidgetProps {
  customInformation?: CustomInformation;
}

export const MissionWidget: FC<MissionWidgetProps> = ({
  customInformation,
}) => {
  const { currentActiveTaskType, isCurrentActiveTaskCompleted } =
    useMissionStore();

  const renderContent = (): ReactNode => {
    if (isCurrentActiveTaskCompleted) return <MissionTaskComplete />;

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
        <WidgetTrackingProvider
          trackingActionKeys={{
            sourceChainAndTokenSelection:
              TrackingAction.OnSourceChainAndTokenSelectionMission,
            availableRoutes: TrackingAction.OnAvailableRoutesMission,
            routeExecutionStarted:
              TrackingAction.OnRouteExecutionStartedMission,
            routeExecutionCompleted:
              TrackingAction.OnRouteExecutionCompletedMission,
            routeExecutionFailed: TrackingAction.OnRouteExecutionFailedMission,
          }}
          trackingDataActionKeys={{
            routeExecutionStarted:
              TrackingEventDataAction.ExecutionStartMission,
            routeExecutionCompleted:
              TrackingEventDataAction.ExecutionCompletedMission,
            routeExecutionFailed:
              TrackingEventDataAction.ExecutionFailedMission,
          }}
        >
          <MissionBaseWidget />
        </WidgetTrackingProvider>
      </ClientOnly>
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
