'use client';

import Box from '@mui/material/Box';
import { FC, ReactNode } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import { MissionBaseWidget } from 'src/components/Widgets/variants/mission/MissionBaseWidget';
import { ZapWidgetStack } from 'src/components/Zap/ZapWidgetStack';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import {
  TrackingAction,
  TrackingEventDataAction,
} from 'src/const/trackingKeys';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { CustomInformation } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { MissionFormWidget } from './MissionFormWidget';
import { MissionTaskComplete } from './MissionTaskComplete';

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
            changeSettings: TrackingAction.OnChangeSettingsMission,
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
