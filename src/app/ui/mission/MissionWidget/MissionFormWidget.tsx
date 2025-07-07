import { useMissionStore } from 'src/stores/mission';
import {
  MissionWidgetContainer,
  MissionWidgetContentContainer,
  MissionWidgetTitle,
  MissionWidgetDescription,
} from './MissionWidget.styles';
import { Button } from 'src/components/Button';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { openInNewTab } from 'src/utils/openInNewTab';
import { MissionForm } from './MissionForm';

export const MissionFormWidget = () => {
  const { taskTitle, taskDescription, taskCTALink, taskCTAText, taskInputs } =
    useMissionStore();

  const { trackEvent } = useUserTracking();

  const hasForm = !taskCTALink || !!taskInputs;

  const handleClick = () => {
    if (!taskCTALink) {
      return;
    }
    openInNewTab(taskCTALink);
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickMissionCtaSteps,
      label: `click-mission-cta-steps`,
      data: {
        [TrackingEventParameter.MissionCtaStepsTitle]: taskTitle || '',
        [TrackingEventParameter.MissionCtaStepsLink]: taskCTALink || '',
        [TrackingEventParameter.MissionCtaStepsCTA]: taskCTAText || '',
      },
    });
  };

  return (
    <MissionWidgetContainer>
      <MissionWidgetContentContainer>
        <MissionWidgetTitle variant="titleSmall">
          {taskTitle}
        </MissionWidgetTitle>
        <MissionWidgetDescription variant="bodyMedium">
          {taskDescription}
        </MissionWidgetDescription>
      </MissionWidgetContentContainer>
      {hasForm ? (
        <MissionForm />
      ) : (
        <Button onClick={handleClick}>{taskCTAText}</Button>
      )}
    </MissionWidgetContainer>
  );
};
